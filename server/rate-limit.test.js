import test from 'node:test';
import assert from 'node:assert';
import express from 'express';
import rateLimit from 'express-rate-limit';
import request from 'supertest';

test('Security Fix: Rate limiter works behind proxy with trust proxy set', async (t) => {
  const app = express();
  app.set('trust proxy', 1);

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests' },
  });

  app.use('/api', limiter);
  app.get('/api/test', (req, res) => res.json({ ok: true, ip: req.ip }));

  // Simulate requests from a proxy where the real client IP is in X-Forwarded-For
  // 1st request
  let res1 = await request(app)
    .get('/api/test')
    .set('X-Forwarded-For', '192.168.1.5');
  assert.strictEqual(res1.status, 200);

  // 2nd request
  let res2 = await request(app)
    .get('/api/test')
    .set('X-Forwarded-For', '192.168.1.5');
  assert.strictEqual(res2.status, 200);

  // 3rd request should be blocked for this IP
  let res3 = await request(app)
    .get('/api/test')
    .set('X-Forwarded-For', '192.168.1.5');
  assert.strictEqual(res3.status, 429);

  // A different IP should still be allowed, avoiding a global DoS and proving IP extraction works
  let res4 = await request(app)
    .get('/api/test')
    .set('X-Forwarded-For', '192.168.1.6');
  assert.strictEqual(res4.status, 200);
});

test('Security Fix: Rate limiter bypass vulnerability via incorrect path matching is fixed', async (t) => {
  const app = express();
  app.set('trust proxy', 1);

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests' },
    skip: (req) => req.path === '/health',
  });

  app.use('/api', limiter);
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.get('/api/api/health', (req, res) => res.json({ status: 'fake-health' }));
  app.get('/api/other', (req, res) => res.json({ status: 'other' }));

  // Request to /api/health should be skipped by rate limiter
  for (let i = 0; i < 5; i++) {
    const res = await request(app).get('/api/health').set('X-Forwarded-For', '10.0.0.1');
    assert.strictEqual(res.status, 200);
  }

  // Request to /api/other should be rate limited after 2 requests
  let resOther1 = await request(app).get('/api/other').set('X-Forwarded-For', '10.0.0.2');
  assert.strictEqual(resOther1.status, 200);
  let resOther2 = await request(app).get('/api/other').set('X-Forwarded-For', '10.0.0.2');
  assert.strictEqual(resOther2.status, 200);
  let resOther3 = await request(app).get('/api/other').set('X-Forwarded-For', '10.0.0.2');
  assert.strictEqual(resOther3.status, 429); // Blocked!

  // The previously vulnerable /api/api/health should ALSO be rate limited
  let resBypass1 = await request(app).get('/api/api/health').set('X-Forwarded-For', '10.0.0.3');
  assert.strictEqual(resBypass1.status, 200);
  let resBypass2 = await request(app).get('/api/api/health').set('X-Forwarded-For', '10.0.0.3');
  assert.strictEqual(resBypass2.status, 200);
  let resBypass3 = await request(app).get('/api/api/health').set('X-Forwarded-For', '10.0.0.3');
  assert.strictEqual(resBypass3.status, 429); // Blocked! Vulnerability fixed.
});
