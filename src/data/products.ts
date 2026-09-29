import type { Category, Product } from '../types/catalog';

export const categories: Category[] = [
  { id: 'aceites-corporales', name: 'Aceites corporales' },
  { id: 'cuidado-capilar', name: 'Cuidado capilar' },
  { id: 'jabones', name: 'Jabones' },
];

export const products: Product[] = [
  {
    id: 'aceite-corporal-canela', name: 'Aceite de canela y clavos de olor', slug: 'aceite-canela-clavos', category: 'aceites-corporales',
    shortDescription: 'Aceite corporal aromático para una experiencia cálida y relajante.',
    benefits: ['Ideal para masajes corporales', 'Aroma cálido y natural'], priceCop: null,
    image: '/products/aceite-corporal-01.webp', imageAlt: 'Aceite corporal BRAIMARÚ en presentación de vidrio con elementos botánicos',
    featured: true, active: true, sortOrder: 1, ritualTags: ['cuidado-corporal']
  },
  {
    id: 'tratamiento-capilar', name: 'Tratamiento capilar', slug: 'tratamiento-capilar', category: 'cuidado-capilar',
    shortDescription: 'Tratamiento de reparación intensiva y fortalecimiento para el cabello.',
    benefits: ['Reparación intensiva', 'Fortalecimiento'], priceCop: null,
    image: '/products/tratamiento-capilar.webp', imageAlt: 'Tratamiento capilar BRAIMARÚ junto a aceites e ingredientes naturales',
    featured: true, active: true, sortOrder: 3, ritualTags: ['nutrir', 'cuidado-capilar']
  },
  {
    id: 'shampoo-capilar', name: 'Shampoo capilar', slug: 'shampoo-capilar', category: 'cuidado-capilar',
    shortDescription: 'Shampoo de la línea capilar de reparación intensiva y fortalecimiento.',
    benefits: ['Cuidado capilar', 'Fortalecimiento'], priceCop: null,
    image: '/products/shampoo-capilar.webp', imageAlt: 'Shampoo capilar BRAIMARÚ en presentación negra con detalles botánicos',
    featured: false, active: true, sortOrder: 4, ritualTags: ['cuidado-capilar']
  },
  {
    id: 'jabon-cafe-cacao', name: 'Jabón exfoliante de café y cacao', slug: 'jabon-cafe-cacao', category: 'jabones',
    shortDescription: 'Jabón exfoliante con café y cacao, aceite de almendras y vitamina E visibles en la pieza original.',
    benefits: ['Exfoliación', 'Cuidado corporal'], priceCop: null,
    image: '/products/jabon-cafe-cacao.webp', imageAlt: 'Jabón BRAIMARÚ de café y cacao sobre una composición con café y cacao',
    featured: true, active: true, sortOrder: 5, ritualTags: ['exfoliar', 'cuidado-corporal']
  },
  {
    id: 'jabon-avena', name: 'Jabón de avena', slug: 'jabon-avena', category: 'jabones',
    shortDescription: 'Jabón de avena con referencias visibles a ácido hialurónico, vitamina E y aceite de almendras.',
    benefits: ['Hidratación', 'Suavidad'], priceCop: null,
    image: '/products/jabon-avena.webp', imageAlt: 'Jabón de avena BRAIMARÚ con avena y almendras',
    featured: false, active: true, sortOrder: 6, ritualTags: ['hidratar', 'cuidado-corporal']
  }
];
