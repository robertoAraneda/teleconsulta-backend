import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Controller({ path: 'users' })
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.store(createUserDto);
  }

  @Get()
  public findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  public findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch('/:id')
  public edit(
    @Body() createUserDto: CreateUserDto,
    @Param('id') id: number,
  ): Promise<User> {
    return this.userService.edit(id, createUserDto);
  }

  @Delete('/:id')
  public remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
