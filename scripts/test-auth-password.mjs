import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { webcrypto } from 'node:crypto';
import { verifyPassword } from '../worker/auth/password.ts';

const password = 'AuthTestPassword-100k';
const salt = randomBytes(16);
const digest = pbkdf2Sync(password, salt, 100_000, 32, 'sha256');
const validHash = `pbkdf2-sha256$100000$${salt.toString('base64url')}$${digest.toString('base64url')}`;

const valid = await verifyPassword(password, validHash, webcrypto.subtle);
if (!valid) throw new Error('Expected 100,000-iteration PBKDF2 hash to verify.');

const wrongPassword = await verifyPassword('wrong-password', validHash, webcrypto.subtle);
if (wrongPassword) throw new Error('Expected wrong password to be rejected.');

let overLimitThrew = false;
let overLimitResult = true;
try {
  overLimitResult = await verifyPassword(
    password,
    validHash.replace('$100000$', '$100001$'),
    {
      importKey() {
        throw new Error('Web Crypto should not be called for over-limit hashes.');
      },
      deriveBits() {
        throw new Error('Web Crypto should not be called for over-limit hashes.');
      },
    },
  );
} catch {
  overLimitThrew = true;
}

if (overLimitThrew || overLimitResult) {
  throw new Error('Expected >100,000 iterations to return false without throwing.');
}

const failingSubtle = {
  async importKey() {
    throw new Error('Simulated Web Crypto failure.');
  },
  async deriveBits() {
    throw new Error('Simulated Web Crypto failure.');
  },
};

let cryptoFailureThrew = false;
let cryptoFailureResult = true;
try {
  cryptoFailureResult = await verifyPassword(password, validHash, failingSubtle);
} catch {
  cryptoFailureThrew = true;
}

if (cryptoFailureThrew || cryptoFailureResult) {
  throw new Error('Expected Web Crypto failure to return false without throwing.');
}

console.log('PBKDF2 auth self-test PASS');
