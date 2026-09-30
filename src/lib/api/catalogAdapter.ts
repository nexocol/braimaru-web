import type { ApiCategory, ApiProduct } from './types';
import type { Category, Product, ProductCategory, RitualTag } from '../../types/catalog';

const PRODUCT_CATEGORIES = new Set<ProductCategory>([
  'aceites-corporales',
  'cuidado-capilar',
  'jabones',
]);

const RITUAL_TAGS = new Set<RitualTag>([
  'hidratar',
  'nutrir',
  'exfoliar',
  'cuidado-corporal',
  'cuidado-capilar',
]);

function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.has(value as ProductCategory);
}

function isRitualTag(value: string): value is RitualTag {
  return RITUAL_TAGS.has(value as RitualTag);
}

export function adaptApiProduct(input: ApiProduct): Product | null {
  if (!isProductCategory(input.category.id)) return null;

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    category: input.category.id,
    shortDescription: input.short_description,
    description: input.description ?? undefined,
    benefits: input.benefits.filter((benefit) => typeof benefit === 'string'),
    priceCop: input.price_cop,
    image: input.image_url,
    imageAlt: input.image_url ? `${input.name} BRAIMARÚ` : '',
    featured: input.featured,
    active: input.active,
    sortOrder: input.sort_order,
    ritualTags: input.ritual_tags.filter(isRitualTag),
  };
}

export function adaptApiCategory(input: ApiCategory): Category | null {
  if (!isProductCategory(input.id)) return null;
  return { id: input.id, name: input.name };
}
