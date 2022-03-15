import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Not } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByRun: jest.fn().mockReturnValue({
              id: 1,
              name: 'NAME',
              lastname: 'LASTNAME',
              password: 'PASS',
              run: '11111111-1',
              email: 'robaraneda@gmail.com',
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest
              .fn()
              .mockReturnValue(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUk9CRVJUTyBBTEVKQU5EUk8iLCJzdWIiOjI2LCJwcm9maWxlIjoiRXhwZXJ0byIsImlhdCI6MTYzNjcyMzc4MSwiZXhwIjoxNjM2NzI3MzgxfQ.om_GenH2vUbql69XcftRAqxdlB7_RviBXdOPncIgnD0',
              ),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should authService be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should userService be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('JWT', () => {
    it('should return an user when credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const userAuth: AuthLoginDto = { run: '11111111-1', password: 'admin' };
      const { access_token } = await authService.validateUser(userAuth);

      expect(access_token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });

    it('should return a UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      try {
        const userAuth: AuthLoginDto = { run: '11111111-1', password: 'admi' };
        await authService.validateUser(userAuth);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should return a UnauthorizedException when user not found', async () => {
      jest.spyOn(userService, 'findByRun').mockImplementation(async () => null);

      try {
        const userAuth: AuthLoginDto = { run: 'unknown', password: 'admin' };
        await authService.validateUser(userAuth);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
