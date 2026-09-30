export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  short_description: string;
  description: string | null;
  benefits: string[];
  price_cop: number | null;
  image_key: string | null;
  image_url: string | null;
  ritual_tags: string[];
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface SiteSettings {
  whatsapp_phone: string | null;
  instagram_url: string | null;
  brand_email: string | null;
  [key: string]: string | null;
}

export interface RuntimeHealth {
  ok: boolean;
  service: string;
  mode: 'development' | 'preview' | 'production';
  bindings: {
    d1: boolean;
    r2: boolean;
  };
}
