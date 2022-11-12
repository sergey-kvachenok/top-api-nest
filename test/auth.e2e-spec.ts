import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/constants';
import { AuthDto } from 'src/auth/dto/Auth.dto';

const authData: AuthDto = {
  email: 'test@test.com',
  password: '123'
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule,],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login - success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(authData)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined()
      })
  });

  it('/auth/login - error', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...authData, password: '1234' })
      .expect(401)
      .then(({ body }: request.Response) => {
        expect(body).toEqual({
          "statusCode": 401,
          "message": "Incorrect password",
          "error": "Unauthorized"
        })
      })
  });

  it('/auth/login - error', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...authData, email: 'test-wrong@test.com' })
      .expect(401, {
        "statusCode": 401,
        "message": "Current user not found",
        "error": "Unauthorized"
      })


  });

  afterAll(() => {
    disconnect()
  })
});
