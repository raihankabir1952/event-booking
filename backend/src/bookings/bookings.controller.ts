import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req: any) {
    return this.bookingsService.createBooking(dto.eventId, req.user);
  }

  @Get('my')
  myBookings(@Req() req: any) {
    return this.bookingsService.myBookings(req.user);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.cancelBooking(+id, req.user);
  }
}
