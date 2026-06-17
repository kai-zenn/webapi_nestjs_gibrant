import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import request from 'supertest';

describe('NestJS REST API E2E', () => {
  let app: INestApplication;
  let token: string;
  let testUserId: string;
  let testPostId: number;
  let testCommentId: number;

  const uniqueSuffix = Date.now();
  const testUser = {
    firstName: 'E2E',
    lastName: 'Tester',
    username: `e2e_user_${uniqueSuffix}`,
    email: `e2e_${uniqueSuffix}@mail.com`,
    password: 'Password123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    testUserId = registerRes.body.data.id;

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: testUser.password,
      })
      .expect(201);

    token = loginRes.body.data.token;
    expect(token).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('should login and return JWT token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
  });

  describe('Public GET endpoints', () => {
    it('GET /api/posts should be accessible without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/posts')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/comments should be accessible without token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/comments')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Protected POST /posts', () => {
    it('should reject creating post without token', async () => {
      await request(app.getHttpServer())
        .post('/api/posts')
        .send({
          title: 'E2E Post',
          content: 'Testing protected endpoint',
          authorId: testUserId,
          publishedDate: '2026-06-09',
        })
        .expect(401);
    });

    it('should allow creating post with token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'E2E Post',
          content: 'Testing protected endpoint',
          authorId: testUserId,
          publishedDate: '2026-06-09',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      testPostId = res.body.data.id;
    });
  });

  describe('Protected POST /comments', () => {
    it('should reject creating comment without token', async () => {
      await request(app.getHttpServer())
        .post(`/api/posts/${testPostId}/comments`)
        .send({
          body: 'Comment tanpa token',
          postId: testPostId,
          userId: testUserId,
        })
        .expect(401);
    });

    it('should allow creating comment with token', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          body: 'Comment dengan token',
          postId: testPostId,
          userId: testUserId,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].id).toBeDefined();
      testCommentId = res.body.data[0].id;
    });
  });

  describe('Protected PATCH /comments/:id', () => {
    it('should reject updating comment without token', async () => {
      await request(app.getHttpServer())
        .patch(`/api/comments/${testCommentId}`)
        .send({
          body: 'Updated comment',
        })
        .expect(401);
    });

    it('should allow updating comment with token', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          body: 'Updated comment',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('Protected DELETE /comments/:id', () => {
    it('should reject deleting comment without token', async () => {
      await request(app.getHttpServer())
        .delete(`/api/comments/${testCommentId}`)
        .expect(401);
    });

    it('should allow deleting comment with token', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/comments/${testCommentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('Protected PATCH /posts/:id', () => {
    it('should reject updating post without token', async () => {
      await request(app.getHttpServer())
        .patch(`/api/posts/${testPostId}`)
        .send({
          title: 'Updated title',
        })
        .expect(401);
    });

    it('should allow updating post with token', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated title',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('Protected DELETE /posts/:id', () => {
    it('should reject deleting post without token', async () => {
      await request(app.getHttpServer())
        .delete(`/api/posts/${testPostId}`)
        .expect(401);
    });

    it('should allow deleting post with token', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/posts/${testPostId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.message).toContain('Post berhasil dihapus');
    });
  });

});
