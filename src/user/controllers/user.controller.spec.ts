import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

const createUserDto: CreateUserDto = {
  name: 'firstName #1',
  lastname: 'lastName #1',
  email: 'mail@mail.cl',
  password: 'password',
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: {
            store: jest
              .fn()
              .mockImplementation((user: CreateUserDto) =>
                Promise.resolve({ id: 1, ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'firstName #1',
                lastname: 'lastName #1',
                email: 'mail@mail.cl',
                password: 'password',
              },
              {
                name: 'firstName #2',
                lastname: 'lastName #2',
                email: 'mail@mail.cl',
                password: 'password',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                name: 'firstName #1',
                lastname: 'lastName #1',
                email: 'mail@mail.cl',
                password: 'password',
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a user', () => {
      userController.create(createUserDto);
      expect(userController.create(createUserDto)).resolves.toEqual({
        id: 1,
        ...createUserDto,
      });
      expect(userService.store).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll()', () => {
    it('should find all users ', () => {
      userController.findAll();
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a user', () => {
      expect(userController.findOne(1)).resolves.toEqual({
        name: 'firstName #1',
        lastname: 'lastName #1',
        email: 'mail@mail.cl',
        password: 'password',
        id: 1,
      });
      expect(userService.findOne).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove the user', () => {
      userController.remove(2);
      expect(userService.remove).toHaveBeenCalled();
    });
  });
});
