import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { NotFoundException } from '@nestjs/common';

const userArray = [
  {
    run: '11111111-1',
    name: 'sample name1 1',
    lastname: 'sample lastname 1',
    email: 'sample email 1',
    password: 'sample password 1',
  },
  {
    run: '22222222-2',
    name: 'sample name 2',
    lastname: 'sample lastname 2',
    email: 'sample email 2',
    password: 'sample password 2',
  },
];

const oneUser = {
  run: '11111111-1',
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
        run: '11111111-1',
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };

      const result = await userService.store(createUserDto);
      expect(userRepository.store).toHaveBeenCalledTimes(1);
      expect(result.run).toEqual(createUserDto.run);
    });
  });

  describe('edit()', () => {
    it('should patch a user in the database', async () => {
      const createUserDto = {
        run: '11111111-1',
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };

      const result = await userService.edit(1, createUserDto);
      expect(userRepository.edit).toHaveBeenCalledTimes(1);

      expect(result.run).toEqual(createUserDto.run);
    });

    it('throws an error as a user is not found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(userService.edit(1)).rejects.toThrow(NotFoundException);
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
        run: '11111111-1',
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };
      const result = await userService.findOne(1);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should retrieve a user with a run', async () => {
      const mockUser = {
        run: '11111111-1',
        name: 'sample name',
        lastname: 'sample lastname',
        email: 'sample email',
        password: 'sample password',
      };
      const result = await userService.findByRun();
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('throws an error as a user is not found by ID', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('throws an error as a user is not found by run', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(userService.findByRun('run')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should delete user', async () => {
      const returnValue = await userService.remove(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);

      expect(returnValue).toBeUndefined();
    });

    it('throws an error as a user is not found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(userService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
