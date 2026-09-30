import type { ProductRecord } from '../db/catalogRepository';

function parseStringArray(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function encodeMediaKey(key: string) {
  return key.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

export function imageUrlFromKey(imageKey: string | null) {
  if (!imageKey) return null;
  if (imageKey.startsWith('static:')) return `/${imageKey.slice('static:'.length)}`;
  return `/media/${encodeMediaKey(imageKey)}`;
}

export function serializeProduct(row: ProductRecord) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
    },
    short_description: row.short_description,
    description: row.description,
    benefits: parseStringArray(row.benefits_json),
    price_cop: row.price_cop,
    image_key: row.image_key,
    image_url: imageUrlFromKey(row.image_key),
    ritual_tags: parseStringArray(row.ritual_tags_json),
    featured: row.featured === 1,
    active: row.active === 1,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
