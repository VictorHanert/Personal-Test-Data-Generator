import request from 'supertest';
import app from '../index.js';

test('GET /validate-cpr should return correct gender', async () => {
  // even last digit → female
  const res = await request(app).get('/validate-cpr?cpr=0101011234&gender=female');
  expect(res.statusCode).toBe(200);
  expect(res.body.gender).toBe('female');
});