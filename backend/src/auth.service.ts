import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async register(username: string, password: string): Promise<any> {
    console.log('Registering user:', username);

    const existingUser = await this.userRepository.findOne({where : {username}})
    if (existingUser) {
      throw new BadRequestException("User with this username already exists")
    };


    const hashed = await this.hashPassword(password);
    const user = this.userRepository.create({ username, password: hashed });
    const saved = await this.userRepository.save(user);
    const token = jwt.sign({ userId: saved.id, username }, JWT_SECRET, { expiresIn: '24h' });
    
    return { token, userId: saved.id };
  }

  async login(username: string, password: string): Promise<any> {
    
    const existingUser = await this.userRepository.findOne({where : {username}})
    if (!existingUser) {
      throw new UnauthorizedException("Wrong password or username")
    };
    
    if (!await this.verifyPassword(password, existingUser.password)) {
      throw new UnauthorizedException("Wrong password or username")
    }
    
    const token = jwt.sign({ userId: existingUser.id, username }, JWT_SECRET, { expiresIn: '24h' });
    return { token, userId: existingUser.id };
  }

  // async refreshToken(token: string) {
  //   // TODO: implement refresh tokens
  //   return null;
  // }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}
