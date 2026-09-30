import type { D1DatabaseLike } from '../types';

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  short_description: string;
  description: string | null;
  benefits_json: string;
  price_cop: number | null;
  image_key: string | null;
  ritual_tags_json: string;
  featured: number;
  active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: number;
}

export interface ProductMutationInput {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string | null;
  benefits: string[];
  priceCop: number | null;
  imageKey: string | null;
  ritualTags: string[];
  featured: boolean;
  active: boolean;
  sortOrder: number;
}

const PRODUCT_SELECT = `
  SELECT
    p.id,
    p.name,
    p.slug,
    p.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    p.short_description,
    p.description,
    p.benefits_json,
    p.price_cop,
    p.image_key,
    p.ritual_tags_json,
    p.featured,
    p.active,
    p.sort_order,
    p.created_at,
    p.updated_at
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

export async function listPublicProducts(db: D1DatabaseLike) {
  const result = await db.prepare(
    `${PRODUCT_SELECT}
     WHERE p.active = 1 AND c.active = 1
     ORDER BY p.sort_order ASC, p.name ASC`,
  ).all<ProductRecord>();

  return result.results ?? [];
}

export async function listAdminProducts(db: D1DatabaseLike) {
  const result = await db.prepare(
    `${PRODUCT_SELECT}
     ORDER BY p.sort_order ASC, p.name ASC`,
  ).all<ProductRecord>();

  return result.results ?? [];
}

export async function getProductById(db: D1DatabaseLike, id: string) {
  return db.prepare(
    `${PRODUCT_SELECT} WHERE p.id = ? LIMIT 1`,
  ).bind(id).first<ProductRecord>();
}

export async function listCategories(db: D1DatabaseLike, onlyActive = true) {
  const where = onlyActive ? 'WHERE active = 1' : '';
  const result = await db.prepare(
    `SELECT id, name, slug, sort_order, active
     FROM categories
     ${where}
     ORDER BY sort_order ASC, name ASC`,
  ).all<CategoryRecord>();

  return result.results ?? [];
}

export async function categoryExists(db: D1DatabaseLike, categoryId: string) {
  const row = await db.prepare(
    'SELECT id FROM categories WHERE id = ? AND active = 1 LIMIT 1',
  ).bind(categoryId).first<{ id: string }>();

  return Boolean(row);
}

export interface SiteSettingsMutationInput {
  whatsapp_phone: string | null;
  instagram_url: string | null;
  brand_email: string | null;
}

export async function getSiteSettings(db: D1DatabaseLike) {
  const result = await db.prepare(
    'SELECT key, value FROM site_settings ORDER BY key ASC',
  ).all<{ key: string; value: string | null }>();

  return Object.fromEntries((result.results ?? []).map((row) => [row.key, row.value]));
}

export async function updateSiteSettings(
  db: D1DatabaseLike,
  input: SiteSettingsMutationInput,
) {
  const statements = Object.entries(input).map(([key, value]) =>
    db.prepare(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         updated_at = CURRENT_TIMESTAMP`,
    ).bind(key, value),
  );

  await db.batch(statements);
  return getSiteSettings(db);
}

export async function createProduct(db: D1DatabaseLike, input: ProductMutationInput) {
  await db.prepare(
    `INSERT INTO products (
      id, name, slug, category_id, short_description, description,
      benefits_json, price_cop, image_key, ritual_tags_json,
      featured, active, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
  ).bind(
    input.id,
    input.name,
    input.slug,
    input.categoryId,
    input.shortDescription,
    input.description,
    JSON.stringify(input.benefits),
    input.priceCop,
    input.imageKey,
    JSON.stringify(input.ritualTags),
    input.featured ? 1 : 0,
    input.active ? 1 : 0,
    input.sortOrder,
  ).run();

  return getProductById(db, input.id);
}

export async function updateProduct(db: D1DatabaseLike, input: ProductMutationInput) {
  await db.prepare(
    `UPDATE products SET
      name = ?,
      slug = ?,
      category_id = ?,
      short_description = ?,
      description = ?,
      benefits_json = ?,
      price_cop = ?,
      image_key = ?,
      ritual_tags_json = ?,
      featured = ?,
      active = ?,
      sort_order = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
  ).bind(
    input.name,
    input.slug,
    input.categoryId,
    input.shortDescription,
    input.description,
    JSON.stringify(input.benefits),
    input.priceCop,
    input.imageKey,
    JSON.stringify(input.ritualTags),
    input.featured ? 1 : 0,
    input.active ? 1 : 0,
    input.sortOrder,
    input.id,
  ).run();

  return getProductById(db, input.id);
}

export async function deleteProduct(db: D1DatabaseLike, id: string) {
  return db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
}
