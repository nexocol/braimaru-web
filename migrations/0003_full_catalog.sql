INSERT INTO categories (id, name, slug, sort_order, active) VALUES
  ('aceites-corporales', 'Aceites corporales', 'aceites-corporales', 1, 1),
  ('cuidado-capilar', 'Cuidado capilar', 'cuidado-capilar', 2, 1),
  ('jabones', 'Jabones', 'jabones', 3, 1),
  ('cremas-corporales', 'Cremas corporales', 'cremas-corporales', 4, 1),
  ('cuidado-labial', 'Cuidado labial', 'cuidado-labial', 5, 1)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  active = excluded.active;

INSERT INTO products (
  id, name, slug, category_id, short_description, description,
  benefits_json, price_cop, image_key, ritual_tags_json,
  featured, active, sort_order
) VALUES
  (
    'aceite-corporal-canela',
    'Aceite de canela y clavos de olor',
    'aceite-canela-clavos',
    'aceites-corporales',
    'Aceite corporal de canela y clavos de olor.',
    NULL,
    '["Ideal para masajes corporales","Aroma cálido y natural"]',
    NULL,
    'static:products/aceite-corporal-01.webp',
    '["cuidado-corporal"]',
    1, 1, 1
  ),
  (
    'aceite-corporal-cafe-naranja',
    'Aceite corporal Café y Naranja',
    'aceite-corporal-cafe-naranja',
    'aceites-corporales',
    'Aceite corporal Café y Naranja de BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/aceite-cafe-naranja.webp',
    '["cuidado-corporal"]',
    0, 1, 2
  ),
  (
    'aceite-corporal-calendula-naranja',
    'Aceite corporal Caléndula y Naranja',
    'aceite-corporal-calendula-naranja',
    'aceites-corporales',
    'Aceite corporal Caléndula y Naranja de BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/aceite-naranja-calendula.webp',
    '["cuidado-corporal"]',
    0, 1, 3
  ),
  (
    'shampoo-capilar',
    'Shampoo capilar',
    'shampoo-capilar',
    'cuidado-capilar',
    'Shampoo con ortiga, manzanilla y canela.',
    NULL,
    '["Limpia","Fortalece","Nutre"]',
    NULL,
    'static:products/shampoo-capilar-v11.webp',
    '["nutrir","cuidado-capilar"]',
    1, 1, 4
  ),
  (
    'acondicionador-capilar',
    'Acondicionador capilar',
    'acondicionador-capilar',
    'cuidado-capilar',
    'Acondicionador con ortiga, manzanilla y canela.',
    NULL,
    '["Hidrata","Desenreda","Suaviza"]',
    NULL,
    'static:products/acondicionador-capilar-v11.webp',
    '["hidratar","cuidado-capilar"]',
    1, 1, 5
  ),
  (
    'termoprotector-capilar',
    'Termoprotector capilar',
    'termoprotector-capilar',
    'cuidado-capilar',
    'Termoprotector capilar BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/termoprotector-capilar.webp',
    '["cuidado-capilar"]',
    0, 1, 6
  ),
  (
    'jabon-exfoliante-cafe',
    'Jabón exfoliante de café',
    'jabon-exfoliante-cafe',
    'jabones',
    'Jabón exfoliante de café BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/jabon-exfoliante-cafe.webp',
    '["exfoliar","cuidado-corporal"]',
    0, 1, 7
  ),
  (
    'jabon-maracuya',
    'Jabón de Maracuyá',
    'jabon-maracuya',
    'jabones',
    'Jabón de Maracuyá BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/jabon-maracuya.webp',
    '["cuidado-corporal"]',
    0, 1, 8
  ),
  (
    'jabon-avena-aclarante',
    'Jabón de Avena Aclarante',
    'jabon-avena-aclarante',
    'jabones',
    'Jabón de Avena Aclarante BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/jabon-avena-aclarante.webp',
    '["cuidado-corporal"]',
    0, 1, 9
  ),
  (
    'jabon-avena-miel',
    'Jabón de Avena y Miel',
    'jabon-avena-miel',
    'jabones',
    'Jabón de Avena y Miel BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/jabon-avena-miel.webp',
    '["cuidado-corporal"]',
    0, 1, 10
  ),
  (
    'jabon-canela-clavos',
    'Jabón de Canela y Clavos de Olor',
    'jabon-canela-clavos',
    'jabones',
    'Jabón de Canela y Clavos de Olor BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/jabon-canela-clavos.webp',
    '["cuidado-corporal"]',
    0, 1, 11
  ),
  (
    'jabon-coco',
    'Jabón de Coco',
    'jabon-coco',
    'jabones',
    'Jabón de Coco BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/jabon-coco.webp',
    '["cuidado-corporal"]',
    0, 1, 12
  ),
  (
    'jabon-manzana-verde',
    'Jabón hidratante Manzana Verde',
    'jabon-manzana-verde',
    'jabones',
    'Jabón hidratante Manzana Verde BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/jabon-manzana-verde.webp',
    '["cuidado-corporal"]',
    0, 1, 13
  ),
  (
    'crema-manos-corporal',
    'Crema de manos y corporal',
    'crema-manos-corporal',
    'cremas-corporales',
    'Crema de manos y corporal BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/crema-manos-corporal.webp',
    '["cuidado-corporal"]',
    0, 1, 14
  ),
  (
    'balsamo-labial',
    'Bálsamo labial',
    'balsamo-labial',
    'cuidado-labial',
    'Bálsamo labial BRAIMARÚ.',
    NULL,
    '[]',
    NULL,
    'static:products/catalog/balsamo-labial.webp',
    '["cuidado-corporal"]',
    0, 1, 15
  )
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  slug = excluded.slug,
  category_id = excluded.category_id,
  short_description = excluded.short_description,
  description = excluded.description,
  benefits_json = excluded.benefits_json,
  price_cop = excluded.price_cop,
  image_key = excluded.image_key,
  ritual_tags_json = excluded.ritual_tags_json,
  featured = excluded.featured,
  active = excluded.active,
  sort_order = excluded.sort_order,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_phone', '573233653482'),
  ('instagram_url', NULL),
  ('brand_email', NULL)
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;
