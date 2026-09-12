import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { Booking } from 'src/bookings/entities/booking.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  date: string;

  @Column()
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  price: number;

  @Column({ default: 20 })
  capacity: number;

  @ManyToOne(() => User, user => user.events, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @OneToMany(() => Booking, booking => booking.event)
  bookings: Booking[];
}
