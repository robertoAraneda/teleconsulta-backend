import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';

const createUserDto: CreateUserDto = {
  run: '11111111-1',
  name: 'firstName #1',
  lastname: 'lastName #1',
  email: 'mail@mail.cl',
  password: 'password',
};

const updateUserDto: UpdateUserDto = {
  name: 'updated name',
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
            edit: jest
              .fn()
              .mockImplementation((id: number, user: UpdateUserDto) =>
                Promise.resolve({ id, ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                run: '11111111-1',
                name: 'firstName #1',
                lastname: 'lastName #1',
                email: 'mail@mail.cl',
                password: 'password',
              },
              {
                run: '11111111-1',
                name: 'firstName #2',
                lastname: 'lastName #2',
                email: 'mail@mail.cl',
                password: 'password',
              },
            ]),
            findByRun: jest.fn().mockImplementation((run: string) =>
              Promise.resolve({
                name: 'firstName #1',
                lastname: 'lastName #1',
                email: 'mail@mail.cl',
                password: 'password',
                id: 1,
                run,
              }),
            ),

            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                run: '11111111-1',
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
    it('should find a user by ID', () => {
      expect(userController.findOne(1)).resolves.toEqual({
        name: 'firstName #1',
        lastname: 'lastName #1',
        email: 'mail@mail.cl',
        password: 'password',
        run: '11111111-1',
        id: 1,
      });
      expect(userService.findOne).toHaveBeenCalled();
    });

    it('should find a user by run', () => {
      expect(userController.findByRun('11111111-1')).resolves.toEqual({
        name: 'firstName #1',
        lastname: 'lastName #1',
        email: 'mail@mail.cl',
        password: 'password',
        run: '11111111-1',
        id: 1,
      });
      expect(userService.findByRun).toHaveBeenCalled();
    });
  });

  describe('edit()', () => {
    it('should edit a user', () => {
      expect(userController.edit(1, updateUserDto)).resolves.toEqual({
        id: 1,
        name: 'updated name',
      });
      expect(userService.edit).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove the user', () => {
      userController.remove(2);
      expect(userService.remove).toHaveBeenCalled();
    });
  });
});
