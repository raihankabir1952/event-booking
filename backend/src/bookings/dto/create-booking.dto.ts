import { IsInt } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  eventId: number;
}
