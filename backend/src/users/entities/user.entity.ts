import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  // Relation: User can create multiple events
  @OneToMany(() => Event, (event) => event.creator)
  events: Event[];

  // Relation: User can have multiple bookings
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
