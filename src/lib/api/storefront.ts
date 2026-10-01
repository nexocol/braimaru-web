import { categories as fixtureCategories, products as fixtureProducts } from '../../data/products';
import type { Category, Product } from '../../types/catalog';
import type { SiteSettings } from './types';

interface StorefrontData {
  products: Product[];
  categories: Category[];
  site: SiteSettings;
  source: 'api' | 'fixtures';
  warning: string | null;
}

const FROZEN_SITE: SiteSettings = {
  whatsapp_phone: '573233653482',
  instagram_url: null,
  brand_email: null,
};

/**
 * Portfolio snapshot of the client-approved BRAIMARÚ V2.
 *
 * This branch intentionally does not read /api/products, /api/categories or /api/site.
 * The storefront renders only the approved fixture catalog bundled with this commit, so
 * future Production admin edits, deletes or credential changes cannot alter this copy.
 */
export async function loadStorefrontData(): Promise<StorefrontData> {
  return {
    products: fixtureProducts,
    categories: fixtureCategories,
    site: FROZEN_SITE,
    source: 'fixtures',
    warning: null,
  };
}
