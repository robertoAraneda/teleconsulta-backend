import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { NotFoundException } from '@nestjs/common';

const userArray = [
  {
    name: 'sample name1 1',
    lastname: 'sample lastname 1',
    email: 'sample email 1',
    password: 'sample password 1',
  },
  {
    name: 'sample name 2',
    lastname: 'sample lastname 2',
    email: 'sample email 2',
    password: 'sample password 2',
  },
];

const oneUser = {
  name: 'sample name',
  lastname: 'sample lastname',
  email: 'sample email',
  password: 'sample password',
};

describe('UserService', () => {
  let userService;
  let userRepository;
  const mockUserRepository = () => ({
    store: jest.fn().mockResolvedValue(oneUser),
    save: jest.fn().mockResolvedValue(oneUser),
    edit: jest.fn().mockResolvedValue(oneUser),
    find: jest.fn().mockResolvedValue(userArray),
    findOne: jest.fn().mockResolvedValue(oneUser),
    delete: jest.fn(),
    remove: jest.fn(),
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

  it('should userService be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should userRepository be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('create()', () => {
    it('should save a user in the database', async () => {
      const createUserDto = {
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };

      const result = await userService.store(createUserDto);
      expect(userRepository.store).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });
  });

  describe('edit()', () => {
    it('should patch a user in the database', async () => {
      const createUserDto = {
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };

      //find one return an object used for userRepositoty.editUser
      const result = await userService.edit(1, createUserDto);
      expect(userRepository.edit).toHaveBeenCalledWith(createUserDto, oneUser);

      expect(result).toEqual(createUserDto);
    });
  });

  describe('findAll()', () => {
    it('should get all users', async () => {
      const result = await userService.findAll();
      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual(userArray);
    });
  });

  describe('findOne()', () => {
    it('should retrieve a user with an ID', async () => {
      const mockUser = {
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };
      const result = await userService.findOne(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('throws an error as a user is not found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should delete user', async () => {
      const returnValue = await userService.remove(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);

      expect(returnValue).toBeUndefined();
    });
  });
});
