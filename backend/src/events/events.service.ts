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

  // ১. সব ইভেন্ট দেখার সময় সাথে attendeeCount দেখাবে
  async findAll(): Promise<Event[]> {
    return this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.creator', 'creator')
      .loadRelationCountAndMap('event.attendeeCount', 'event.bookings')
      .getMany();
  }

  // ২. নির্দিষ্ট একটি ইভেন্ট দেখার সময় attendeeCount দেখাবে
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

  // ৩. সার্চ করার সময়ও attendeeCount দেখাবে
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

  // ৪. ইভেন্ট তৈরি করা
  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    const event = this.eventsRepository.create({ ...createEventDto, creator: user });
    return this.eventsRepository.save(event);
  }

  // ৫. ইভেন্ট আপডেট করা
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  // ৬. ইভেন্ট ডিলিট করা
  async remove(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    await this.eventsRepository.remove(event);
    return event;
  }

  // ৭. ইভেন্টের Attendee লিস্ট পাওয়া (Total Count সহ)
  async getAttendeeList(eventId: number, userId: number) {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId, creator: { id: userId } },
      relations: ['bookings', 'bookings.user'],
    });

    if (!event) {
      throw new NotFoundException('Event not found or you are not the creator');
    }

    // এটেন্ডি লিস্ট ম্যাপ করা
    const attendees = event.bookings.map(booking => ({
      bookingId: booking.id,
      userName: booking.user.name,
      userEmail: booking.user.email,
    }));

    // আউটপুটে কাউন্ট এবং লিস্ট একসাথে পাঠানো
    return {
      Count: attendees.length,
      attendees: attendees,
    };
  }
}
