const HASH_PREFIX = 'pbkdf2-sha256';
const MIN_ITERATIONS = 100_000;
const textEncoder = new TextEncoder();

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + padding);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function asArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }
  return diff === 0;
}

export async function verifyPassword(password: string, encodedHash: string) {
  const parts = encodedHash.split('$');
  if (parts.length !== 4 || parts[0] !== HASH_PREFIX) return false;

  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < MIN_ITERATIONS) return false;

  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = decodeBase64Url(parts[2]);
    expected = decodeBase64Url(parts[3]);
  } catch {
    return false;
  }

  if (salt.length < 16 || expected.length !== 32) return false;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const derived = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt: asArrayBuffer(salt),
        iterations,
      },
      keyMaterial,
      256,
    ),
  );

  return constantTimeEqual(derived, expected);
}
