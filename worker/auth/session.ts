export const ADMIN_SESSION_COOKIE = 'braimaru_admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

interface SessionPayload {
  v: 1;
  sub: string;
  iat: number;
  exp: number;
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + padding);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function asArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function importHmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function parseCookieHeader(header: string | null) {
  const cookies = new Map<string, string>();
  if (!header) return cookies;

  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (name) cookies.set(name, value);
  }

  return cookies;
}

export async function createSessionToken(
  username: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  ttlSeconds = ADMIN_SESSION_TTL_SECONDS,
) {
  const payload: SessionPayload = {
    v: 1,
    sub: username,
    iat: nowSeconds,
    exp: nowSeconds + ttlSeconds,
  };

  const encodedPayload = encodeBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const signature = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, textEncoder.encode(encodedPayload)),
  );

  return `v1.${encodedPayload}.${encodeBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  expectedUsername: string,
  nowSeconds = Math.floor(Date.now() / 1000),
) {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return null;

  const [, encodedPayload, encodedSignature] = parts;

  let payloadBytes: Uint8Array;
  let signature: Uint8Array;
  try {
    payloadBytes = decodeBase64Url(encodedPayload);
    signature = decodeBase64Url(encodedSignature);
  } catch {
    return null;
  }

  const key = await importHmacKey(secret);
  const signatureValid = await crypto.subtle.verify(
    'HMAC',
    key,
    asArrayBuffer(signature),
    textEncoder.encode(encodedPayload),
  );
  if (!signatureValid) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(textDecoder.decode(payloadBytes)) as SessionPayload;
  } catch {
    return null;
  }

  if (
    payload.v !== 1 ||
    payload.sub !== expectedUsername ||
    !Number.isInteger(payload.iat) ||
    !Number.isInteger(payload.exp) ||
    payload.exp <= nowSeconds ||
    payload.iat > nowSeconds + 60
  ) {
    return null;
  }

  return payload;
}

export async function getSessionFromRequest(
  request: Request,
  username: string,
  sessionSecret: string,
) {
  const token = parseCookieHeader(request.headers.get('cookie')).get(ADMIN_SESSION_COOKIE);
  if (!token) return null;
  return verifySessionToken(token, sessionSecret, username);
}

export function createSessionCookie(token: string, maxAgeSeconds = ADMIN_SESSION_TTL_SECONDS) {
  return [
    `${ADMIN_SESSION_COOKIE}=${token}`,
    `Max-Age=${maxAgeSeconds}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
  ].join('; ');
}

export function clearSessionCookie() {
  return [
    `${ADMIN_SESSION_COOKIE}=`,
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
  ].join('; ');
}
