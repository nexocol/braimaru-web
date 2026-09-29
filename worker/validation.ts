import type { D1DatabaseLike } from './types';
import { categoryExists, type ProductMutationInput } from './db/catalogRepository';

export const RITUAL_TAGS = new Set([
  'hidratar',
  'nutrir',
  'exfoliar',
  'cuidado-corporal',
  'cuidado-capilar',
]);

interface RawProductInput {
  name?: unknown;
  slug?: unknown;
  category_id?: unknown;
  short_description?: unknown;
  description?: unknown;
  benefits?: unknown;
  price_cop?: unknown;
  image_key?: unknown;
  ritual_tags?: unknown;
  featured?: unknown;
  active?: unknown;
  sort_order?: unknown;
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

function nullableString(value: unknown, maxLength: number) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string') return undefined;
  const cleaned = value.trim();
  if (cleaned.length > maxLength) return undefined;
  return cleaned || null;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

export async function validateProductInput(
  db: D1DatabaseLike,
  raw: RawProductInput,
  id: string,
): Promise<{ value?: ProductMutationInput; errors: Record<string, string> }> {
  const errors: Record<string, string> = {};

  const name = cleanString(raw.name, 140);
  const slug = cleanString(raw.slug, 160);
  const categoryId = cleanString(raw.category_id, 80);
  const shortDescription = cleanString(raw.short_description, 280);
  const description = nullableString(raw.description, 3000);
  const imageKey = nullableString(raw.image_key, 300);

  if (!name) errors.name = 'Name is required and must be 140 characters or fewer.';
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = 'Slug is required and must use lowercase letters, numbers and hyphens.';
  }
  if (!categoryId || !(await categoryExists(db, categoryId))) {
    errors.category_id = 'Category is invalid.';
  }
  if (!shortDescription) {
    errors.short_description = 'Short description is required and must be 280 characters or fewer.';
  }
  if (description === undefined) errors.description = 'Description is too long.';
  if (imageKey === undefined) errors.image_key = 'Image key is invalid.';

  const benefits = Array.isArray(raw.benefits)
    ? raw.benefits
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 20)
    : [];
  if (benefits.some((item) => item.length > 160)) {
    errors.benefits = 'Each benefit must be 160 characters or fewer.';
  }

  const ritualTags = Array.isArray(raw.ritual_tags)
    ? raw.ritual_tags.filter((item): item is string => typeof item === 'string')
    : [];
  if (ritualTags.some((tag) => !RITUAL_TAGS.has(tag))) {
    errors.ritual_tags = 'One or more ritual tags are invalid.';
  }

  let priceCop: number | null = null;
  if (raw.price_cop !== null && raw.price_cop !== undefined && raw.price_cop !== '') {
    if (
      typeof raw.price_cop !== 'number' ||
      !Number.isInteger(raw.price_cop) ||
      raw.price_cop < 0
    ) {
      errors.price_cop = 'Price must be a non-negative integer in COP or null.';
    } else {
      priceCop = raw.price_cop;
    }
  }

  const sortOrder =
    typeof raw.sort_order === 'number' && Number.isInteger(raw.sort_order) && raw.sort_order >= 0
      ? raw.sort_order
      : null;
  if (sortOrder === null) errors.sort_order = 'Sort order must be a non-negative integer.';

  if (Object.keys(errors).length > 0 || !name || !slug || !categoryId || !shortDescription || sortOrder === null) {
    return { errors };
  }

  return {
    errors,
    value: {
      id,
      name,
      slug,
      categoryId,
      shortDescription,
      description: description ?? null,
      benefits,
      priceCop,
      imageKey: imageKey ?? null,
      ritualTags,
      featured: booleanValue(raw.featured, false),
      active: booleanValue(raw.active, true),
      sortOrder,
    },
  };
}
