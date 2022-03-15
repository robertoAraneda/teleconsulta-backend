import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { UserService } from '../src/user/services/user.service';
import { User } from '../src/user/entities/user.entity';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    connection = app.get(Connection);

    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  it('/users (GET)', async () => {
    await userService.store({
      run: '11111111-1',
      name: 'ROBERTO ALEJANDRO',
      lastname: 'ARANEDA',
      email: 'robaraneda@gmail.com',
      password: 'admin',
    });

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);

    return response;
  });

  it('/users (POST)', async () => {
    const createUserDto: CreateUserDto = {
      run: '11111111-1',
      name: 'ROBERTO ALEJANDRO',
      lastname: 'ARANEDA',
      email: 'robaraneda@gmail.com',
      password: 'admin',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body.name).toEqual(createUserDto.name);

    return response;
  });

  describe('/users/run/:run', () => {
    it('It should get an user by run', async () => {
      const createUserDto: CreateUserDto = {
        run: '11111111-1',
        name: 'ROBERTO ALEJANDRO',
        lastname: 'ARANEDA',
        email: 'robaraneda@gmail.com',
        password: 'admin',
      };

      const responseUser = await userService.store(createUserDto);

      const response = await request(app.getHttpServer())
        .get('/users/run/' + responseUser.run)
        .expect(200);

      expect(response.body.id).toEqual(responseUser.id);

      return response;
    });

    it("It should throw a NotFoundException if user doesn't exist", async () => {
      const unknownRun = 'unknown run';

      const response = await request(app.getHttpServer())
        .get(`/users/run/${unknownRun}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual('User not found');

      return response;
    });
  });

  describe('/users/:id (GET)', () => {
    it('It should get an user by ID', async () => {
      const createUserDto: CreateUserDto = {
        run: '11111111-1',
        name: 'ROBERTO ALEJANDRO',
        lastname: 'ARANEDA',
        email: 'robaraneda@gmail.com',
        password: 'admin',
      };

      const responseUser = await userService.store(createUserDto);

      const response = await request(app.getHttpServer())
        .get('/users/' + responseUser.id)
        .expect(200);

      expect(response.body.id).toEqual(responseUser.id);

      return response;
    });

    it("It should throw a NotFoundException if user doesn't exist", async () => {
      const unknownId = 999;

      const response = await request(app.getHttpServer())
        .get(`/users/${unknownId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual('User not found');

      return response;
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('It should update an user', async () => {
      const createUserDto: CreateUserDto = {
        run: '11111111-1',
        name: 'ROBERTO ALEJANDRO',
        lastname: 'ARANEDA',
        email: 'robaraneda@gmail.com',
        password: 'admin',
      };

      const responseUser = await userService.store(createUserDto);

      const response = await request(app.getHttpServer())
        .patch('/users/' + responseUser.id)
        .send({ name: 'edited', password: 'admin' })
        .expect(200);

      expect(response.body.id).toEqual(responseUser.id);
      expect(response.body.name).toEqual('edited');
      return response;
    });

    it("It should throw a NotFoundException if user doesn't exist", async () => {
      const unknownId = 999;

      const response = await request(app.getHttpServer())
        .patch(`/users/${unknownId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual('User not found');

      return response;
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('It should delete an user', async () => {
      const createUserDto: CreateUserDto = {
        run: '11111111-1',
        name: 'ROBERTO ALEJANDRO',
        lastname: 'ARANEDA',
        email: 'robaraneda@gmail.com',
        password: 'admin',
      };

      const responseUser = await userService.store(createUserDto);

      const response = await request(app.getHttpServer())
        .delete('/users/' + responseUser.id)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({});
      return response;
    });

    it("It should throw a NotFoundException if user doesn't exist", async () => {
      const unknownId = 999;

      const response = await request(app.getHttpServer())
        .delete(`/users/${unknownId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual('User not found');

      return response;
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
