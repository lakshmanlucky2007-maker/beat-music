// test/twist.test.js - the 3 twist tests from the brief (run: npm test)
process.env.DB_FILE = ':memory:';

const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

let server;
let base;

test.before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    base = `http://localhost:${server.address().port}`;
    resolve();
  });
}));
test.after(() => server.close());

test('Test 1: ?page=1&limit=2 -> 200, 2 instruments', async () => {
  const res = await fetch(`${base}/instruments?page=1&limit=2`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.page, 1);
  assert.strictEqual(body.data.length, 2);
  assert.ok(body.total >= 2);
});

test('Test 2: ?page=2&limit=2 -> 200, the next 2', async () => {
  const first = await (await fetch(`${base}/instruments?page=1&limit=2`)).json();
  const res = await fetch(`${base}/instruments?page=2&limit=2`);
  const body = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.page, 2);
  assert.strictEqual(body.data.length, 2);
  const firstIds = first.data.map((i) => i.id);
  body.data.forEach((i) => assert.ok(!firstIds.includes(i.id), 'page 2 must not repeat page 1'));
});

test('Test 3: ?page=0 -> 400', async () => {
  const res = await fetch(`${base}/instruments?page=0`);
  assert.strictEqual(res.status, 400);
  assert.ok((await res.json()).error);
});

test('Extra: negative limit -> 400', async () => {
  const res = await fetch(`${base}/instruments?limit=-1`);
  assert.strictEqual(res.status, 400);
});

test('Extra: defaults are page 1 and limit 5', async () => {
  const body = await (await fetch(`${base}/instruments`)).json();
  assert.strictEqual(body.page, 1);
  assert.strictEqual(body.limit, 5);
  assert.strictEqual(body.data.length, 5);
});
