INSERT OR REPLACE INTO categories (id, name, slug, sort_order, active) VALUES
  ('aceites-corporales', 'Aceites corporales', 'aceites-corporales', 1, 1),
  ('cuidado-capilar', 'Cuidado capilar', 'cuidado-capilar', 2, 1),
  ('jabones', 'Jabones', 'jabones', 3, 1);

INSERT OR REPLACE INTO products (
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
    1, 1, 2
  ),
  (
    'acondicionador-capilar',
    'Acondicionador capilar',
    'acondicionador-capilar',
    'cuidado-capilar',
    'Acondicionador con ortiga, manzanilla y canela.',
    NULL,
    'static:products/acondicionador-capilar-v11.webp',
    '["Hidrata","Desenreda","Suaviza"]',
    NULL,
    '["hidratar","cuidado-capilar"]',
    1, 1, 3
  );

INSERT OR REPLACE INTO site_settings (key, value) VALUES
  ('whatsapp_phone', NULL),
  ('instagram_url', NULL),
  ('brand_email', NULL);
