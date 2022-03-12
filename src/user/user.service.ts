import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto);
  }

  public async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getUser(userId: number): Promise<User> {
    const foundUser = await this.userRepository.findOne(userId);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  public async editUser(
    userId: number,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const editedUser = await this.userRepository.findOne(userId);
    if (!editedUser) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.editUser(createUserDto, editedUser);
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
