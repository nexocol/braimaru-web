export type ProductCategory =
  | 'aceites-corporales'
  | 'cuidado-capilar'
  | 'jabones'
  | 'cremas-corporales'
  | 'cuidado-labial';
export type RitualTag = 'hidratar' | 'nutrir' | 'exfoliar' | 'cuidado-corporal' | 'cuidado-capilar';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  description?: string;
  benefits: string[];
  priceCop: number | null;
  image: string | null;
  imageAlt: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  ritualTags: RitualTag[];
}

export interface Category {
  id: ProductCategory;
  name: string;
}
