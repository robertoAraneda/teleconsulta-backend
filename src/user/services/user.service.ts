import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async store(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedOPassword = await UserService.hashPassword(
      createUserDto.password,
      salt,
    );

    return this.userRepository.store({
      ...createUserDto,
      password: hashedOPassword,
    });
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

  async findByRun(run: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({ where: { run } });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async edit(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const editedUser = await this.userRepository.findOne(id);
    if (!editedUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await UserService.hashPassword(
        updateUserDto.password,
        salt,
      );
    }

    return this.userRepository.edit(updateUserDto, editedUser);
  }

  async remove(id: number): Promise<void> {
    const editedUser = await this.userRepository.findOne(id);
    if (!editedUser) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
  }

  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
