import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toEqual({
          id: 1,
          name: 'Ana Silva',
          email: 'ana@example.com',
        });
      });
  });

  it('GET /users/:id', () => {
    return request(app.getHttpServer()).get('/users/1').expect(200).expect({
      id: 1,
      name: 'Ana Silva',
      email: 'ana@example.com',
    });
  });

  it('POST /users', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Carla Souza', email: 'carla@example.com' })
      .expect(201)
      .expect({
        id: 3,
        name: 'Carla Souza',
        email: 'carla@example.com',
      });
  });
});
