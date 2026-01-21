import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe, 
  UseGuards, 
  Req, 
  Query
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity'; 
import { Request } from 'express';

// Extend Request to include user from JWT
interface RequestWithUser extends Request {
  user: User;
}

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ১. GET /events (সব ইভেন্ট দেখা)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllEvents() {
    return this.eventsService.findAll();
  }

  // ২. GET /events/search (সার্চ করা)
  @UseGuards(JwtAuthGuard)
  @Get('search')
  searchEvents(@Query() filterDto: FilterEventDto) {
    return this.eventsService.searchEvents(filterDto);
  }

  // ৩. GET /events/:id/attendees (অর্গানাইজারের জন্য এটেন্ডি লিস্ট)
  // এটি অবশ্যই ':id' এর উপরে রাখা ভালো অথবা এর নিচেও কাজ করবে কারণ এটি একটি সাব-রাউট।
  @UseGuards(JwtAuthGuard)
  @Get(':id/attendees')
  getAttendees(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.eventsService.getAttendeeList(id, req.user.id);
  }

  // ৪. GET /events/:id (নির্দিষ্ট ইভেন্ট দেখা)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findById(id);
  }

  // ৫. POST /events (নতুন ইভেন্ট তৈরি)
  @UseGuards(JwtAuthGuard)
  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.eventsService.create(createEventDto, user);
  }

  // ৬. PATCH /events/:id (ইভেন্ট আপডেট)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  // ৭. DELETE /events/:id (ইভেন্ট ডিলিট)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
