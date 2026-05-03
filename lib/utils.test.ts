import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeUrl, cn, formatDate } from './utils.ts';

test('sanitizeUrl securely processes URLs', async (t) => {
  await t.test('allows valid http/https URLs', () => {
    assert.strictEqual(sanitizeUrl('http://example.com'), 'http://example.com/');
    assert.strictEqual(sanitizeUrl('https://example.com'), 'https://example.com/');
  });

  await t.test('prepends https to domain-only URLs', () => {
    assert.strictEqual(sanitizeUrl('example.com'), 'https://example.com/');
    assert.strictEqual(sanitizeUrl('www.google.com'), 'https://www.google.com/');
  });

  await t.test('strips whitespace safely', () => {
    assert.strictEqual(sanitizeUrl('  https://example.com  '), 'https://example.com/');
  });

  await t.test('blocks javascript: protocol and returns empty string', () => {
    assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
    assert.strictEqual(sanitizeUrl('  javascript:alert(1)  '), '');
    assert.strictEqual(sanitizeUrl('java\nscript:alert(1)'), '');
    assert.strictEqual(sanitizeUrl('jAvascript:alert(1)'), '');
    assert.strictEqual(sanitizeUrl('javascript://%250Aalert(1)'), '');
  });

  await t.test('blocks other potentially dangerous protocols', () => {
    assert.strictEqual(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '');
    assert.strictEqual(sanitizeUrl('vbscript:msgbox(1)'), '');
    assert.strictEqual(sanitizeUrl('file:///etc/passwd'), '');
  });

  await t.test('handles null/undefined/empty gracefully', () => {
    assert.strictEqual(sanitizeUrl(null), '');
    assert.strictEqual(sanitizeUrl(undefined), '');
    assert.strictEqual(sanitizeUrl(''), '');
    assert.strictEqual(sanitizeUrl('   '), '');
  });
});

test('cn combines classes correctly', () => {
  assert.strictEqual(cn('a', 'b'), 'a b');
  assert.strictEqual(cn('a', undefined, 'b', null, false), 'a b');
  assert.strictEqual(cn('a', { b: true, c: false }), 'a b');
});

test('formatDate formats correctly', () => {
  // Use UTC to avoid timezone issues in tests
  process.env.TZ = 'UTC';
  assert.strictEqual(formatDate('2023-10-15'), 'Oct 15, 2023');
});
