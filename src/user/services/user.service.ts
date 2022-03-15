import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async store(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.store(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const foundUser = await this.userRepository.findOne(id);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async edit(id: number, createUserDto: CreateUserDto): Promise<User> {
    const editedUser = await this.userRepository.findOne(id);
    if (!editedUser) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.edit(createUserDto, editedUser);
  }

  async remove(id: number): Promise<void> {
    const editedUser = await this.userRepository.findOne(id);
    if (!editedUser) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
  }
}
