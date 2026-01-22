// src/users/users.service.ts

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Get all users
  async findAll() {
    return this.usersRepository.find({
      select: ['id', 'email', 'name'],
    });
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    return this.usersRepository.save(user);
  }

  // Find user by ID
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id }, 
      select: ['id', 'email', 'name'] 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update user details
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  // Delete user
  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);

    return {
      message: 'Member deleted successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Find by email (Used in Login and Forgot Password)
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // --- পাসওয়ার্ড রিসেট ফিচারের জন্য নতুন মেথডসমূহ --- [১.১.১]

  // ১. রিসেট টোকেন আপডেট করা
  async updateResetToken(user: User): Promise<void> {
    await this.usersRepository.save(user);
  }

  // ২. টোকেন দিয়ে ইউজারকে খুঁজে বের করা
  async findByResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  // ৩. পাসওয়ার্ড পরিবর্তনের পর সম্পূর্ণ ইউজার অবজেক্ট সেভ করা
  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
