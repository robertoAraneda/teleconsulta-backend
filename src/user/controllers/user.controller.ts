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
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller({ path: 'users', version: '1' })
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

  @Get('/run/:run')
  public findByRun(@Param('run') run: string): Promise<User> {
    return this.userService.findByRun(run);
  }

  @Patch('/:id')
  public edit(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.edit(id, updateUserDto);
  }

  @Delete('/:id')
  public remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
