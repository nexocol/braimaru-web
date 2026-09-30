import { categories as fixtureCategories, products as fixtureProducts } from '../../data/products';
import type { Category, Product } from '../../types/catalog';
import { adaptApiCategory, adaptApiProduct } from './catalogAdapter';
import type { ApiCategory, ApiProduct, RuntimeHealth, SiteSettings } from './types';

interface StorefrontData {
  products: Product[];
  categories: Category[];
  site: SiteSettings;
  source: 'api' | 'fixtures';
  warning: string | null;
}

class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new ApiRequestError(`Request failed: ${url}`, response.status);
  }

  const value: unknown = await response.json();
  return value as T;
}

async function getRuntimeHealth() {
  return getJson<RuntimeHealth>('/api/health');
}

export async function loadStorefrontData(): Promise<StorefrontData> {
  let health: RuntimeHealth | null = null;

  try {
    health = await getRuntimeHealth();

    const [productResponse, categoryResponse, siteResponse] = await Promise.all([
      getJson<{ products: ApiProduct[] }>('/api/products'),
      getJson<{ categories: ApiCategory[] }>('/api/categories'),
      getJson<{ settings: SiteSettings }>('/api/site'),
    ]);

    const products = productResponse.products
      .map(adaptApiProduct)
      .filter((product): product is Product => Boolean(product));

    const categories = categoryResponse.categories
      .map(adaptApiCategory)
      .filter((category): category is Category => Boolean(category));

    return {
      products,
      categories,
      site: siteResponse.settings,
      source: 'api',
      warning: null,
    };
  } catch (error) {
    const mode = health?.mode ?? (import.meta.env.DEV ? 'development' : 'production');

    if (mode !== 'production') {
      const warning =
        'Catalog API unavailable in development/preview; controlled fixture fallback is active.';
      console.warn(`[BRAIMARÚ] ${warning}`, error);

      return {
        products: fixtureProducts,
        categories: fixtureCategories,
        site: {
          whatsapp_phone: null,
          instagram_url: null,
          brand_email: null,
        },
        source: 'fixtures',
        warning,
      };
    }

    throw error;
  }
}
