import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

import { Booking } from 'src/bookings/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
  ],

  controllers: [PaymentsController],

  providers: [PaymentsService],
})
export class PaymentsModule {}