import { Repository, EntityRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async store(createUserDto: CreateUserDto): Promise<User> {
    const { name, lastname, email, password } = createUserDto;

    const user = new User();
    user.name = name;
    user.lastname = lastname;
    user.email = email;
    user.password = password;

    await user.save();
    return user;
  }

  public async edit(
    createUserDto: CreateUserDto,
    editedUser: User,
  ): Promise<User> {
    const { name, lastname, email, password } = createUserDto;
    editedUser.name = name;
    editedUser.lastname = lastname;
    editedUser.email = email;
    editedUser.password = password;
    await editedUser.save();

    return editedUser;
  }
}
