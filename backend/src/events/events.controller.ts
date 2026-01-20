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
  Req 
} from '@nestjs/common';
import { EventsService } from './events.service';
import type { CreateEventDto } from './dto/create-event.dto';
import type { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { User } from 'src/users/entities/user.entity';
import type { Request } from 'express';

// Extend Request to include user from JWT
interface RequestWithUser extends Request {
  user: User;
}

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // GET /events
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllEvents() {
    return this.eventsService.findAll();
  }

  // GET /events/:id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findById(id);
  }

  // POST /events
  @UseGuards(JwtAuthGuard)
  @Post()
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.eventsService.create(createEventDto, user);
  }

  // PATCH /events/:id
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  // DELETE /events/:id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
