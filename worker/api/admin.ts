import { getAdminAuthConfig } from '../auth/config';
import { getSessionFromRequest } from '../auth/session';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getSiteSettings,
  listAdminProducts,
  updateProduct,
  updateSiteSettings,
} from '../db/catalogRepository';
import { deleteAdminMedia, uploadAdminMedia } from '../media';
import type { Env } from '../types';
import { validateProductInput } from '../validation';
import { apiError, json, readJsonBody } from './http';
import { serializeProduct } from './serializers';

function normalizeNullableString(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function validateSiteSettingsInput(raw: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const whatsappPhone = normalizeNullableString(raw.whatsapp_phone);
  const instagramUrl = normalizeNullableString(raw.instagram_url);
  const brandEmail = normalizeNullableString(raw.brand_email);

  if (whatsappPhone === undefined) {
    errors.whatsapp_phone = 'El WhatsApp debe ser texto o quedar vacío.';
  } else if (whatsappPhone) {
    const digits = whatsappPhone.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
      errors.whatsapp_phone = 'Usa un número internacional de 8 a 15 dígitos.';
    }
  }

  if (instagramUrl === undefined) {
    errors.instagram_url = 'Instagram debe ser una URL o quedar vacío.';
  } else if (instagramUrl) {
    try {
      const parsed = new URL(instagramUrl);
      const hostname = parsed.hostname.toLowerCase();
      if (
        (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') ||
        (hostname !== 'instagram.com' && !hostname.endsWith('.instagram.com'))
      ) {
        errors.instagram_url = 'Usa una URL válida de Instagram.';
      }
    } catch {
      errors.instagram_url = 'Usa una URL válida de Instagram.';
    }
  }

  if (brandEmail === undefined) {
    errors.brand_email = 'El correo debe ser texto o quedar vacío.';
  } else if (
    brandEmail &&
    (brandEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brandEmail))
  ) {
    errors.brand_email = 'Usa un correo electrónico válido.';
  }

  if (Object.keys(errors).length > 0) {
    return { value: null, errors };
  }

  return {
    value: {
      whatsapp_phone: whatsappPhone ?? null,
      instagram_url: instagramUrl ?? null,
      brand_email: brandEmail ?? null,
    },
    errors,
  };
}

async function requireAdminSession(request: Request, env: Env) {
  const config = getAdminAuthConfig(env);
  if (!config) {
    return {
      response: apiError(
        503,
        'auth_not_configured',
        'La autenticación administrativa todavía no está configurada.',
      ),
    };
  }

  const session = await getSessionFromRequest(
    request,
    config.username,
    config.sessionSecret,
  );

  if (!session) {
    return {
      response: apiError(401, 'authentication_required', 'Authentication required.'),
    };
  }

  return { session };
}

export async function handleAdminApi(request: Request, env: Env, pathname: string) {
  if (!pathname.startsWith('/api/admin/')) return null;

  const auth = await requireAdminSession(request, env);
  if ('response' in auth) return auth.response;

  if (!env.DB) {
    return apiError(503, 'database_unavailable', 'Admin database is not configured.');
  }

  if (pathname === '/api/admin/site' && request.method === 'GET') {
    return json({ settings: await getSiteSettings(env.DB) });
  }

  if (pathname === '/api/admin/site' && request.method === 'PUT') {
    const raw = await readJsonBody<Record<string, unknown>>(request);
    if (!raw) return apiError(400, 'invalid_json', 'A valid JSON body is required.');

    const validated = validateSiteSettingsInput(raw);
    if (!validated.value) {
      return apiError(422, 'validation_error', 'Site settings validation failed.', validated.errors);
    }

    const settings = await updateSiteSettings(env.DB, validated.value);
    return json({ settings });
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
