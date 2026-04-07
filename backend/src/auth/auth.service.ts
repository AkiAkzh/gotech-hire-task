import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AuthResponse, VerifiedJwtPayload } from '../types/auth.types';
import {
  BCRYPT_SALT_ROUNDS,
  JWT_EXPIRES_IN,
  INVALID_CREDENTIALS_MESSAGE,
  USER_ALREADY_EXISTS_MESSAGE,
} from './auth.constants';

// TODO: consider using NestJS ConfigModule / ConfigService for centralized configuration management
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async register(username: string, password: string): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new BadRequestException(USER_ALREADY_EXISTS_MESSAGE);
    }

    const hashed = await this.hashPassword(password);
    const user = this.userRepository.create({ username, password: hashed });
    const saved = await this.userRepository.save(user);
    const token = jwt.sign({ userId: saved.id, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { token, userId: saved.id };
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({ where: { username } });

    if (!existingUser) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    if (!(await this.verifyPassword(password, existingUser.password))) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const token = jwt.sign(
      { userId: existingUser.id, username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN },
    );

    return { token, userId: existingUser.id };
  }

  verifyToken(token: string): VerifiedJwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as VerifiedJwtPayload;
    } catch {
      return null;
    }
  }
}