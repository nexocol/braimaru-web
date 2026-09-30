import type { Env } from './types';
import { apiError, json } from './api/http';

const ALLOWED_MEDIA_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
]);

const MAX_MEDIA_BYTES = 5 * 1024 * 1024;

export function isValidMediaKey(key: string) {
  return (
    key.length > 0 &&
    key.length <= 300 &&
    !key.startsWith('/') &&
    !key.includes('..') &&
    /^[a-zA-Z0-9/_\-.]+$/.test(key)
  );
}

export async function handlePublicMedia(request: Request, env: Env, pathname: string) {
  if (!pathname.startsWith('/media/')) return null;
  if (request.method !== 'GET') {
    return apiError(405, 'method_not_allowed', 'Method not allowed.');
  }
  if (!env.MEDIA) {
    return apiError(503, 'media_unavailable', 'Media storage is not configured.');
  }

  const rawKey = pathname.slice('/media/'.length);
  let key: string;
  try {
    key = rawKey.split('/').map((segment) => decodeURIComponent(segment)).join('/');
  } catch {
    return apiError(400, 'invalid_media_key', 'Invalid media key.');
  }

  if (!isValidMediaKey(key)) {
    return apiError(400, 'invalid_media_key', 'Invalid media key.');
  }

  const object = await env.MEDIA.get(key);
  if (!object) {
    return apiError(404, 'media_not_found', 'Media not found.');
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', `"${key}"`);
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(object.body, { headers });
}

export async function uploadAdminMedia(request: Request, env: Env) {
  if (!env.MEDIA) {
    return apiError(503, 'media_unavailable', 'Media storage is not configured.');
  }

  const contentType = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  const extension = ALLOWED_MEDIA_TYPES.get(contentType);

  if (!extension) {
    return apiError(415, 'invalid_media_type', 'Unsupported image MIME type.');
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength === 0) {
    return apiError(400, 'empty_media', 'Image file is empty.');
  }
  if (bytes.byteLength > MAX_MEDIA_BYTES) {
    return apiError(413, 'media_too_large', 'Image exceeds the 5 MB upload limit.');
  }

  const key = `products/${crypto.randomUUID()}.${extension}`;
  await env.MEDIA.put(key, bytes, {
    httpMetadata: { contentType },
  });

  return json(
    {
      key,
      url: `/media/${key}`,
      content_type: contentType,
      size: bytes.byteLength,
    },
    { status: 201 },
  );
}

export async function deleteAdminMedia(env: Env, key: string) {
  if (!env.MEDIA) {
    return apiError(503, 'media_unavailable', 'Media storage is not configured.');
  }
  if (!isValidMediaKey(key) || key.startsWith('static:')) {
    return apiError(400, 'invalid_media_key', 'Invalid media key.');
  }

  await env.MEDIA.delete(key);
  return json({ deleted: true, key });
}
