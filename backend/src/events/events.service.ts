// backend/src/events/events.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/users/entities/user.entity';
import { FilterEventDto } from './dto/filter-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  // show all events with attendeeCount
  async findAll(): Promise<Event[]> {
    return this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.creator', 'creator')
      .loadRelationCountAndMap('event.attendeeCount', 'event.bookings')
      .getMany();
  }

  // get event by id with attendeeCount
  async findById(id: number): Promise<Event> {
    const event = await this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.creator', 'creator')
      .loadRelationCountAndMap('event.attendeeCount', 'event.bookings')
      .where('event.id = :id', { id })
      .getOne();

    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  // with filters
  async searchEvents(filterDto: FilterEventDto) {
    const { date, location } = filterDto;

    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.creator', 'creator')
      .loadRelationCountAndMap('event.attendeeCount', 'event.bookings');

    if (date) {
      query.andWhere('CAST(event.date AS DATE) = :date', { date });
    }

    if (location) {
      query.andWhere('event.location ILIKE :location', { location: `%${location}%` });
    }

    return query.getMany();
  }

  // create event
  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    const event = this.eventsRepository.create({ ...createEventDto, creator: user });
    return this.eventsRepository.save(event);
  }

  // update event
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  // delete event
  async remove(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    await this.eventsRepository.remove(event);
    return event;
  }

  // list of attendees for an event (only for the organizer)
  async getAttendeeList(eventId: number, userId: number) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId, creator: { id: userId } },
      relations: ['bookings', 'bookings.user'],
    });

    if (!event) {
      throw new NotFoundException('Event not found or you are not the creator');
    }

    //(Descending Order - Latest First)
    const sortedBookings = event.bookings.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // attendee details array
    const attendees = sortedBookings.map(booking => ({
      bookingId: booking.id,
      userName: booking.user.name,
      userEmail: booking.user.email,
      bookedAt: booking.createdAt,
    }));

    // count of attendees
    return {
      Count: attendees.length,
      attendees: attendees,
    };
  }
}
