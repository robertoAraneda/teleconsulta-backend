import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { UserService } from '../src/user/services/user.service';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';
import { AuthService } from '../src/auth/services/auth.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let userService: UserService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);
    connection = app.get(Connection);

    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  describe('/auth/login (POST)', () => {
    it('It should create an access token', async () => {
      await userService.store({
        run: '11111111-1',
        name: 'ROBERTO ALEJANDRO',
        lastname: 'ARANEDA',
        email: 'robaraneda@gmail.com',
        password: 'admin',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ run: '11111111-1', password: 'admin' })
        .expect(HttpStatus.CREATED);

      expect(response.body.access_token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );

      return response;
    });

    it('It should throw a UnauthorizedException if incorrect password', async () => {
      await userService.store({
        run: '11111111-1',
        name: 'ROBERTO ALEJANDRO',
        lastname: 'ARANEDA',
        email: 'robaraneda@gmail.com',
        password: 'admin',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ run: '11111111-1', password: 'admi' })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toEqual('Invalid credentials.');

      return response;
    });

    it("It should throw a NotFoundException if user doesn't exist", async () => {
      await userService.store({
        run: '11111111-1',
        name: 'ROBERTO ALEJANDRO',
        lastname: 'ARANEDA',
        email: 'robaraneda@gmail.com',
        password: 'admin',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ run: 'unknown', password: 'admin' })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual('User not found');

      return response;
    });
  });

  it('/auth/me (GET)', async () => {
    const user = await userService.store({
      run: '11111111-1',
      name: 'ROBERTO ALEJANDRO',
      lastname: 'ARANEDA',
      email: 'robaraneda@gmail.com',
      password: 'admin',
    });

    const { access_token } = await authService.validateUser({
      run: '11111111-1',
      password: 'admin',
    });

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(HttpStatus.OK);

    expect(response.body.id).toEqual(user.id);

    return response;
  });

  afterAll(async () => {
    await app.close();
  });
});
