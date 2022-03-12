import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let userService;
  let userRepository;
  const mockUserRepository = () => ({
    createUser: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();
    userService = await module.get<UserService>(UserService);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    it('should save a user in the database', async () => {
      userRepository.createUser.mockResolvedValue('someUser');
      expect(userRepository.createUser).not.toHaveBeenCalled();
      const createUserDto = {
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };
      const result = await userService.createUser(createUserDto);
      expect(userRepository.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual('someUser');
    });
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      userRepository.find.mockResolvedValue('someUsers');
      expect(userRepository.find).not.toHaveBeenCalled();
      const result = await userService.getUsers();
      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual('someUsers');
    });
  });
});
