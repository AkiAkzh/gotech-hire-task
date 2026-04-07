import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SafeUser } from './types/user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getSafeUsers(): Promise<SafeUser[]> {
    return this.userRepository.find({
      select: ['id', 'username'],
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getSafeUserById(id: number): Promise<SafeUser | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username'],
    });
  }
}