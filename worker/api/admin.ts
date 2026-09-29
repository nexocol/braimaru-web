import {
  createProduct,
  deleteProduct,
  getProductById,
  listAdminProducts,
  updateProduct,
} from '../db/catalogRepository';
import { deleteAdminMedia, uploadAdminMedia } from '../media';
import type { Env } from '../types';
import { validateProductInput } from '../validation';
import { apiError, json, readJsonBody } from './http';
import { serializeProduct } from './serializers';

function hasAccessIdentity(request: Request) {
  return Boolean(
    request.headers.get('cf-access-authenticated-user-email') ||
    request.headers.get('cf-access-jwt-assertion'),
  );
}

function adminAllowed(request: Request, env: Env) {
  const mode = env.BRAIMARU_RESOURCE_MODE ?? 'development';
  if (mode === 'development') return true;
  return hasAccessIdentity(request);
}

export async function handleAdminApi(request: Request, env: Env, pathname: string) {
  if (!pathname.startsWith('/api/admin/')) return null;

  if (!adminAllowed(request, env)) {
    return apiError(
      403,
      'admin_protection_required',
      'Administrative writes require Cloudflare Access in this environment.',
    );
  }

  if (!env.DB) {
    return apiError(503, 'database_unavailable', 'Admin database is not configured.');
  }

  if (pathname === '/api/admin/products' && request.method === 'GET') {
    const products = await listAdminProducts(env.DB);
    return json({ products: products.map(serializeProduct) });
  }

  if (pathname === '/api/admin/products' && request.method === 'POST') {
    const raw = await readJsonBody<Record<string, unknown>>(request);
    if (!raw) return apiError(400, 'invalid_json', 'A valid JSON body is required.');

    const id = crypto.randomUUID();
    const validated = await validateProductInput(env.DB, raw, id);
    if (!validated.value) {
      return apiError(422, 'validation_error', 'Product validation failed.', validated.errors);
    }

    try {
      const product = await createProduct(env.DB, validated.value);
      return json({ product: product ? serializeProduct(product) : null }, { status: 201 });
    } catch {
      return apiError(409, 'product_conflict', 'A product with that slug may already exist.');
    }
  }

  const productMatch = pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
  if (productMatch) {
    const id = decodeURIComponent(productMatch[1]);
    const existing = await getProductById(env.DB, id);
    if (!existing) return apiError(404, 'product_not_found', 'Product not found.');

    if (request.method === 'PUT') {
      const raw = await readJsonBody<Record<string, unknown>>(request);
      if (!raw) return apiError(400, 'invalid_json', 'A valid JSON body is required.');

      const validated = await validateProductInput(env.DB, raw, id);
      if (!validated.value) {
        return apiError(422, 'validation_error', 'Product validation failed.', validated.errors);
      }

      try {
        const product = await updateProduct(env.DB, validated.value);

        if (
          env.MEDIA &&
          existing.image_key &&
          existing.image_key !== validated.value.imageKey &&
          !existing.image_key.startsWith('static:')
        ) {
          await env.MEDIA.delete(existing.image_key).catch(() => undefined);
        }

        return json({ product: product ? serializeProduct(product) : null });
      } catch {
        return apiError(409, 'product_conflict', 'A product with that slug may already exist.');
      }
    }

    if (request.method === 'DELETE') {
      await deleteProduct(env.DB, id);

      if (env.MEDIA && existing.image_key && !existing.image_key.startsWith('static:')) {
        await env.MEDIA.delete(existing.image_key).catch(() => undefined);
      }

      return json({ deleted: true, id });
    }

    return apiError(405, 'method_not_allowed', 'Method not allowed.');
  }

  if (pathname === '/api/admin/media' && request.method === 'POST') {
    return uploadAdminMedia(request, env);
  }

  const mediaMatch = pathname.match(/^\/api\/admin\/media\/(.+)$/);
  if (mediaMatch && request.method === 'DELETE') {
    let key: string;
    try {
      key = mediaMatch[1].split('/').map((segment) => decodeURIComponent(segment)).join('/');
    } catch {
      return apiError(400, 'invalid_media_key', 'Invalid media key.');
    }
    return deleteAdminMedia(env, key);
  }

  return apiError(404, 'admin_route_not_found', 'Admin API route not found.');
}
