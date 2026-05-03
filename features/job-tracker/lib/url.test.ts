import test from 'node:test';
import assert from 'node:assert';
import { isSafeUrl } from './url.ts';

test('isSafeUrl allows http and https', () => {
  global.window = { location: { origin: 'http://localhost' } } as any;
  assert.strictEqual(isSafeUrl('http://example.com'), true);
  assert.strictEqual(isSafeUrl('https://example.com'), true);
});

test('isSafeUrl rejects javascript and data protocols', () => {
  global.window = { location: { origin: 'http://localhost' } } as any;
  assert.strictEqual(isSafeUrl('javascript:alert(1)'), false);
  assert.strictEqual(isSafeUrl('data:text/html,<h1>hi</h1>'), false);
});

test('isSafeUrl allows relative URLs', () => {
  // We need to mock window.location.origin for this test
  global.window = { location: { origin: 'http://localhost' } } as any;
  assert.strictEqual(isSafeUrl('/path'), true);
  assert.strictEqual(isSafeUrl('example.com'), true);
});

test('isSafeUrl rejects null/undefined', () => {
  global.window = { location: { origin: 'http://localhost' } } as any;
  assert.strictEqual(isSafeUrl(undefined as any), false);
  assert.strictEqual(isSafeUrl(''), false);
});
