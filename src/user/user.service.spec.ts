import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService;
  let userRepository;
  const mockUserRepository = () => ({
    createUser: jest.fn(),
    editUser: jest.fn(),
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

  describe('patchUser', () => {
    it('should patch a user in the database', async () => {
      const createUserDto = {
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };

      userRepository.editUser.mockResolvedValue('someUser');

      //find one return an object used for userRepositoty.editUser
      userRepository.findOne.mockResolvedValue(createUserDto);
      expect(userRepository.editUser).not.toHaveBeenCalled();

      const result = await userService.editUser(1, createUserDto);
      expect(userRepository.editUser).toHaveBeenCalledWith(
        createUserDto,
        createUserDto,
      );

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

  describe('getUser', () => {
    it('should retrieve a user with an ID', async () => {
      const mockUser = {
        name: 'Test name',
        lastname: 'Test lastname',
        email: 'Test email',
        password: 'Test password',
      };
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await userService.getUser(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('throws an error as a user is not found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(userService.getUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      userRepository.delete.mockResolvedValue(1);
      expect(userRepository.delete).not.toHaveBeenCalled();
      await userService.deleteUser(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
