import {
  createSessionToken,
  verifySessionToken,
} from '../worker/auth/session.ts';

const secret = 'ci-session-secret-that-is-long-enough-1234567890';
const username = 'admin';
const token = await createSessionToken(username, secret, 1000, 10);

const valid = await verifySessionToken(token, secret, username, 1005);
if (!valid) throw new Error('Expected session to be valid before expiration.');

const expired = await verifySessionToken(token, secret, username, 1011);
if (expired) throw new Error('Expected session to be rejected after expiration.');

const tampered = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;
const tamperedResult = await verifySessionToken(tampered, secret, username, 1005);
if (tamperedResult) throw new Error('Expected tampered session to be rejected.');

console.log('Auth session self-test PASS');
