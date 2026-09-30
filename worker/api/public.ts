import {
  getSiteSettings,
  listCategories,
  listPublicProducts,
} from '../db/catalogRepository';
import type { Env } from '../types';
import { apiError, json } from './http';
import { serializeProduct } from './serializers';

const PUBLIC_CACHE = 'public, max-age=30, s-maxage=60';

export async function handlePublicApi(request: Request, env: Env, pathname: string) {
  if (request.method !== 'GET') {
    return apiError(405, 'method_not_allowed', 'Method not allowed.');
  }

  if (!env.DB) {
    return apiError(
      503,
      'database_unavailable',
      'Catalog data source is not configured for this environment.',
    );
  }

  if (pathname === '/api/products') {
    const products = await listPublicProducts(env.DB);
    return json(
      { products: products.map(serializeProduct) },
      { headers: { 'cache-control': PUBLIC_CACHE } },
    );
  }

  if (pathname === '/api/categories') {
    const categories = await listCategories(env.DB, true);
    return json(
      {
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          sort_order: category.sort_order,
        })),
      },
      { headers: { 'cache-control': PUBLIC_CACHE } },
    );
  }

  if (pathname === '/api/site') {
    const settings = await getSiteSettings(env.DB);
    return json(
      {
        settings,
        mode: env.BRAIMARU_RESOURCE_MODE ?? 'development',
      },
      { headers: { 'cache-control': 'public, max-age=15, s-maxage=30' } },
    );
  }

  return null;
}
