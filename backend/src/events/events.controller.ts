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

  // ১. GET /events 
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllEvents() {
    return this.eventsService.findAll();
  }

  // ২. GET /events/search
  
  @UseGuards(JwtAuthGuard)
  @Get('search')
  searchEvents(@Query() filterDto: FilterEventDto) {
    return this.eventsService.searchEvents(filterDto);
  }

  // ৩. GET /events/:id 
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findById(id);
  }

  // ৪. POST /events 
  @UseGuards(JwtAuthGuard)
  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.eventsService.create(createEventDto, user);
  }

  // ৫. PATCH /events/:id 
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  // ৬. DELETE /events/:id 
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
