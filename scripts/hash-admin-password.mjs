import { pbkdf2Sync, randomBytes } from 'node:crypto';

const password = process.env.ADMIN_PASSWORD;
if (!password) {
  console.error('Set ADMIN_PASSWORD in the environment before running this script.');
  process.exit(1);
}

if (password.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters.');
  process.exit(1);
}

const iterations = 210_000;
const salt = randomBytes(16);
const digest = pbkdf2Sync(password, salt, iterations, 32, 'sha256');

const base64url = (buffer) => buffer.toString('base64url');
process.stdout.write(
  `pbkdf2-sha256$${iterations}$${base64url(salt)}$${base64url(digest)}`,
);
