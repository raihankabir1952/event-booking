import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';

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

    private readonly mailerService: MailerService,
  ) { }

  async createBooking(eventId: number, user: User) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const currentAttendees = await this.bookingRepo.count({
      where: {
        event: { id: eventId },
        paymentStatus: 'PAID',
      },
    });

    if (currentAttendees >= event.capacity) {
      throw new BadRequestException(
        'Event is full! No more seats available.',
      );
    }

    const existingBooking = await this.bookingRepo.findOne({
      where: {
        user: { id: user.id },
        event: { id: event.id },
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'You already booked this event',
      );
    }

    // Create booking with PENDING payment status
    const booking = this.bookingRepo.create({
      event,
      user,
      paymentStatus: 'PENDING',
      transactionId: null,
    });

    const savedBooking =
      await this.bookingRepo.save(booking);

    return savedBooking;
  }

  async myBookings(user: User) {
    return this.bookingRepo.find({
      where: {
        user: { id: user.id },
      },
      relations: ['event'],
    });
  }

  async cancelBooking(id: number, user: User) {
    const booking = await this.bookingRepo.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!booking) {
      throw new NotFoundException(
        'Booking not found',
      );
    }

    return this.bookingRepo.remove(booking);
  }

  // Send confirmation email after successful payment
  async sendBookingConfirmationEmail(
    booking: Booking,
  ) {
    const user = booking.user;
    const event = booking.event;

    await this.mailerService.sendMail({
      to: user.email,

      subject: `Booking Confirmed: ${event.title}`,

      html: `
        <h3>Hello ${user.name},</h3>

        <p>
          Your booking for
          <b>${event.title}</b>
          is confirmed!
        </p>

        <p>
          <b>Location:</b> ${event.location}
        </p>

        <p>
          <b>Date:</b> ${event.date}
        </p>

        <p>
          <b>Payment Status:</b> PAID
        </p>

        <p>
          Thank you for booking with us.
        </p>
      `,
    });
  }
}
