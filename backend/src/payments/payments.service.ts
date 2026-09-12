import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';

import axios from 'axios';

import { Booking } from 'src/bookings/entities/booking.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    private readonly mailerService: MailerService,
  ) { }

  // Start Payment
  async initiatePayment(bookingId: number) {
    try {
      const storeId =
        process.env.SSLCOMMERZ_STORE_ID;

      const storePassword =
        process.env.SSLCOMMERZ_STORE_PASSWORD;

      const apiUrl =
        process.env.SSLCOMMERZ_API_URL;

      // Find booking
      const booking =
        await this.bookingRepo.findOne({
          where: {
            id: bookingId,
          },
          relations: ['user', 'event'],
        });

      if (!booking) {
        throw new NotFoundException(
          'Booking not found',
        );
      }

      const event = booking.event;
      const user = booking.user;

      // Generate unique transaction ID
      const transactionId =
        `BOOKING_${booking.id}_${Date.now()}`;

      const paymentData = {
        store_id: storeId,
        store_passwd: storePassword,

        total_amount: event.price,

        currency: 'BDT',

        tran_id: transactionId,

        success_url:
          'https://event-booking-backend-8eg9.onrender.com/payments/success',

        fail_url:
          'https://event-booking-backend-8eg9.onrender.com/payments/fail',

        cancel_url:
          'https://event-booking-backend-8eg9.onrender.com/payments/cancel',

        ipn_url:
          'https://event-booking-backend-8eg9.onrender.com/payments/ipn',

        product_name: event.title,
        product_category: 'Event',
        product_profile: 'general',

        cus_name: user.name,
        cus_email: user.email,
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
        cus_phone: '01700000000',

        shipping_method: 'NO',
      };

      console.log(
        'Starting SSLCOMMERZ payment...',
      );

      console.log(
        'Booking ID:',
        booking.id,
      );

      console.log(
        'Event:',
        event.title,
      );

      console.log(
        'Amount:',
        event.price,
      );

      console.log(
        'Transaction ID:',
        transactionId,
      );

      // Save transaction ID
      booking.transactionId = transactionId;

      await this.bookingRepo.save(booking);

      // Send payment request
      const response = await axios.post(
        apiUrl!,
        paymentData,
        {
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },
        },
      );

      console.log(
        'SSLCOMMERZ Initiate Response:',
        response.data,
      );

      return response.data;
    } catch (error) {
      console.error(
        'SSLCOMMERZ Payment Error:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to initiate payment',
      );
    }
  }

  // Validate Payment
  async validatePayment(valId: string) {
    try {
      const storeId =
        process.env.SSLCOMMERZ_STORE_ID;

      const storePassword =
        process.env.SSLCOMMERZ_STORE_PASSWORD;

      console.log(
        'Validating SSLCOMMERZ Payment...',
      );

      console.log(
        'Validation ID:',
        valId,
      );

      console.log(
        'Store ID exists:',
        !!storeId,
      );

      console.log(
        'Store Password exists:',
        !!storePassword,
      );

      // Give SSLCOMMERZ Sandbox some time
      await new Promise((resolve) =>
        setTimeout(resolve, 5000),
      );

      const response = await axios.get(
        'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
        {
          params: {
            val_id: valId,
            store_id: storeId,
            store_passwd: storePassword,
            v: 1,
            format: 'json',
          },

          timeout: 15000,
        },
      );

      console.log(
        'Payment Validation Response:',
        response.data,
      );

      return response.data;
    } catch (error) {
      console.error(
        'Payment Validation Error:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to validate payment',
      );
    }
  }

  // Mark booking as PAID after successful validation
  async completePayment(
    transactionId: string,
    paidAmount: number,
  ) {
    const booking =
      await this.bookingRepo.findOne({
        where: {
          transactionId,
        },
        relations: ['user', 'event'],
      });

    if (!booking) {
      throw new NotFoundException(
        'Booking not found for this transaction',
      );
    }

    // Prevent duplicate payment processing
    if (booking.paymentStatus === 'PAID') {
      return booking;
    }

    // Check payment amount
    const eventPrice = Number(
      booking.event.price,
    );

    if (Number(paidAmount) !== eventPrice) {
      throw new BadRequestException(
        'Payment amount does not match event price',
      );
    }

    // Update booking
    booking.paymentStatus = 'PAID';

    const savedBooking =
      await this.bookingRepo.save(booking);

    // Send confirmation email
    await this.mailerService.sendMail({
      to: booking.user.email,

      subject:
        `Booking Confirmed: ${booking.event.title}`,

      html: `
        <h3>Hello ${booking.user.name},</h3>

        <p>
          Your booking for
          <b>${booking.event.title}</b>
          is confirmed!
        </p>

        <p>
          <b>Location:</b>
          ${booking.event.location}
        </p>

        <p>
          <b>Date:</b>
          ${booking.event.date}
        </p>

        <p>
          <b>Amount Paid:</b>
          ${eventPrice} BDT
        </p>

        <p>
          <b>Payment Status:</b>
          PAID
        </p>

        <p>
          <b>Transaction ID:</b>
          ${booking.transactionId}
        </p>

        <p>
          Thank you for booking with us.
        </p>
      `,
    });

    return savedBooking;
  }
}