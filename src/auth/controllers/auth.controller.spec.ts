import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import exp from 'constants';

const authLoginDto: AuthLoginDto = {
  run: '11111111-1',
  password: 'password',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve({ access_token: 'token' }),
              ),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should authController be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should authService be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login()', () => {
    it('should create and access token', () => {
      expect(authController.login(authLoginDto)).resolves.toEqual({
        access_token: 'token',
      });
      expect(authService.validateUser).toHaveBeenCalledWith(authLoginDto);
    });
  });

  describe('me()', () => {
    it('should return a user', () => {
      expect(authController.me({ user: 'user' })).toEqual('user');
    });
  });
});
