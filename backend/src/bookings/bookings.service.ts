import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Event } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  async createBooking(eventId: number, user: User) {
    // 1️⃣ ইভেন্টটি ডাটাবেসে আছে কি না চেক করা
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // 2️⃣ চেক করা: ইভেন্টে সিট খালি আছে কি না (Capacity Check)
    const currentAttendees = await this.bookingRepo.count({
      where: { event: { id: eventId } },
    });

    if (currentAttendees >= event.capacity) {
      throw new BadRequestException('Event is full! No more seats available.');
    }

    // 3️⃣ চেক করা: এই ইউজার আগে থেকেই বুকিং করে রেখেছে কি না (Duplicate check)
    const existingBooking = await this.bookingRepo.findOne({
      where: {
        user: { id: user.id },
        event: { id: event.id },
      },
    });

    if (existingBooking) {
      throw new BadRequestException('You already booked this event');
    }

    // 4️⃣ সব ঠিক থাকলে বুকিং তৈরি এবং সেভ করা
    const booking = this.bookingRepo.create({
      event,
      user,
    });

    return this.bookingRepo.save(booking);
  }

  async myBookings(user: User) {
    return this.bookingRepo.find({
      where: { user: { id: user.id } },
      relations: ['event'],
    });
  }

  async cancelBooking(id: number, user: User) {
    const booking = await this.bookingRepo.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.bookingRepo.remove(booking);
  }
}
