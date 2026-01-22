import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // টোকেন তৈরির জন্য
import { LoginUserDto } from './dto/login-user.dto';
import { MailerService } from '@nestjs-modules/mailer'; // মেইল পাঠানোর জন্য

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService, // মেইলার ইনজেক্ট করুন
  ) {}

  async login(loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ১. Forgot Password লজিক
  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User with this email does not exist');

    // টোকেন তৈরি (র‍্যান্ডম স্ট্রিং)
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // ১ ঘণ্টা মেয়াদ

    await this.usersService.updateResetToken(user); // ইউজার আপডেট করুন

    // ইমেইল পাঠানো
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to set a new password:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>This link will expire in 1 hour.</p>`,
    });

    return { message: 'Reset link sent to email' };
  }

  // ২. Reset Password লজিক
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    // পাসওয়ার্ড হ্যাশ করা এবং সেভ করা
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null; // টোকেন ক্লিয়ার করা
    user.resetPasswordExpires = null;

    await this.usersService.saveUser(user);
    return { message: 'Password reset successful' };
  }
}
