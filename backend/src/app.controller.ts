import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifiedJwtPayload } from './types/auth.types';
import { UsersService } from './users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('auth/register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body.username, body.password);
  }

  @Post('auth/login')
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as VerifiedJwtPayload;
    return this.usersService.getSafeUserById(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers() {
    return this.usersService.getSafeUsers();
  }
}