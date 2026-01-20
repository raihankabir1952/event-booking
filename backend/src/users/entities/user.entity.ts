import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Booking } from '../../bookings/entities/booking.entity';
import { Event } from '../../events/entities/event.entity';

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

  @OneToMany(() => Event, event => event.creator)
  events: Event[];

  // @OneToMany(() => Booking, booking => booking.user)
  // bookings: Booking[];
}
