import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Notebooks API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // primera prueba: POST /notebooks
  it('/notebooks (POST) - debería crear un notebook', () => {
    const newNotebook = {
      title: 'Mi primer E2E',
      content: 'Contenido simple para la prueba',
    };

    return request(app.getHttpServer())
      .post('/notebooks')
      .send(newNotebook)
      .expect(201); // 201 es el código HTTP 
  });

  // Segunda prueba: GET /notebooks
  it('/notebooks (GET) - debería obtener una lista de notebooks', () => {
    return request(app.getHttpServer())
      .get('/notebooks')
      .expect(200); // 200 es el código HTTP de "OK"
  });

  // Después de todas las pruebas, cierra el servidor.
  afterAll(async () => {
    await app.close();
  });
});