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

  // GET /events
  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({ relations: ['creator'] });
  }

  // GET /events/:id
  async findById(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  // POST /events
  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    const event = this.eventsRepository.create({ ...createEventDto, creator: user });
    return this.eventsRepository.save(event);
  }

  // PATCH /events/:id
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  // DELETE /events/:id
  async remove(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    await this.eventsRepository.remove(event);
    return event;
  }

  // GET /events/search

  async searchEvents(filterDto: FilterEventDto) {
  const { date, location } = filterDto;

  const query = this.eventsRepository.createQueryBuilder('event');

  if (date) {
    query.andWhere('CAST(event.date AS DATE) = :date', { date });
  }

  if (location) {
    query.andWhere('event.location ILIKE :location', { location: `%${location}%` });
  }

  return query.getMany();
}

}
