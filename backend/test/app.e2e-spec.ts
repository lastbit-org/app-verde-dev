import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('API (e2e)', () => {
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

  it('GET /users requires login', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('GET /users/:id requires login', () => {
    return request(app.getHttpServer()).get('/users/1').expect(401);
  });

  it('POST /users requires login', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Carla Souza',
        email: 'carla@example.com',
        password: 'secret1',
      })
      .expect(401);
  });

  it('GET /products is public', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toMatchObject({
          id: 1,
          name: 'Oliveira em vaso sage',
          price: 248,
          stock: expect.any(Number),
          image: {
            name: 'oliveira-vaso-sage.jpg',
          },
        });
      });
  });

  it('GET /orders requires login', () => {
    return request(app.getHttpServer()).get('/orders').expect(401);
  });
});
