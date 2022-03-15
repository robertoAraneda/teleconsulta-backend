import { Repository, EntityRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async store(createUserDto: CreateUserDto): Promise<User> {
    const user = new User(createUserDto);

    return await this.save(user);
  }

  public async edit(
    updateUserDto: UpdateUserDto,
    editedUser: User,
  ): Promise<User> {
    this.merge(editedUser, updateUserDto);

    return await this.save(editedUser);
  }
}
