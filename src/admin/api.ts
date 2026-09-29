import type { ApiCategory, ApiProduct } from '../lib/api/types';

export interface AdminProductPayload {
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string | null;
  benefits: string[];
  price_cop: number | null;
  image_key: string | null;
  ritual_tags: string[];
  featured: boolean;
  active: boolean;
  sort_order: number;
}

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

function extractApiError(data: unknown) {
  if (!data || typeof data !== 'object' || !('error' in data)) return null;
  const candidate = (data as { error?: unknown }).error;
  if (!candidate || typeof candidate !== 'object') return null;

  const error = candidate as { code?: unknown; message?: unknown; details?: unknown };
  return {
    code: typeof error.code === 'string' ? error.code : undefined,
    message: typeof error.message === 'string' ? error.message : undefined,
    details: error.details,
  };
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = extractApiError(data);
    throw new AdminApiError(
      error?.message ?? 'Administrative request failed.',
      response.status,
      error?.code,
      error?.details,
    );
  }

  return data as T;
}

export async function fetchAdminProducts() {
  return requestJson<{ products: ApiProduct[] }>('/api/admin/products');
}

export async function fetchAdminCategories() {
  return requestJson<{ categories: ApiCategory[] }>('/api/categories');
}

export async function createAdminProduct(payload: AdminProductPayload) {
  return requestJson<{ product: ApiProduct }>('/api/admin/products', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProduct(id: string, payload: AdminProductPayload) {
  return requestJson<{ product: ApiProduct }>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProduct(id: string) {
  return requestJson<{ deleted: boolean; id: string }>(
    `/api/admin/products/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
}

export async function uploadAdminImage(file: File) {
  return requestJson<{
    key: string;
    url: string;
    content_type: string;
    size: number;
  }>('/api/admin/media', {
    method: 'POST',
    headers: { 'content-type': file.type },
    body: file,
  });
}

export async function deleteAdminImage(key: string) {
  const encodedKey = key.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return requestJson<{ deleted: boolean; key: string }>(`/api/admin/media/${encodedKey}`, {
    method: 'DELETE',
  });
}

export function productToPayload(
  product: ApiProduct,
  overrides: Partial<AdminProductPayload> = {},
): AdminProductPayload {
  return {
    name: product.name,
    slug: product.slug,
    category_id: product.category.id,
    short_description: product.short_description,
    description: product.description,
    benefits: product.benefits,
    price_cop: product.price_cop,
    image_key: product.image_key,
    ritual_tags: product.ritual_tags,
    featured: product.featured,
    active: product.active,
    sort_order: product.sort_order,
    ...overrides,
  };
}
