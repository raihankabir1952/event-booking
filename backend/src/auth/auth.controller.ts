// src/auth/auth.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // login endpoint
  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  // password reset endpoints
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // new reset password endpoint
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('password') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
