import type { Category, Product } from '../types/catalog';

export const categories: Category[] = [
  { id: 'aceites-corporales', name: 'Aceites corporales' },
  { id: 'cuidado-capilar', name: 'Cuidado capilar' },
  { id: 'jabones', name: 'Jabones' },
];

export const products: Product[] = [
  { id:'aceite-corporal-canela', name:'Aceite de canela y clavos de olor', slug:'aceite-canela-clavos', category:'aceites-corporales',
    shortDescription:'Aceite corporal aromático para una experiencia cálida y relajante.',
    benefits:['Ideal para masajes corporales','Aroma cálido y natural'], priceCop:null,
    image:'/products/aceite-corporal-01.webp', imageAlt:'Aceite corporal BRAIMARÚ en presentación de vidrio con elementos botánicos',
    featured:true, active:true, sortOrder:1, ritualTags:['cuidado-corporal'] },
  { id:'tratamiento-capilar', name:'Tratamiento capilar', slug:'tratamiento-capilar', category:'cuidado-capilar',
    shortDescription:'Tratamiento de reparación intensiva y fortalecimiento para el cabello.',
    benefits:['Reparación intensiva','Fortalecimiento'], priceCop:null,
    image:'/products/tratamiento-capilar.webp', imageAlt:'Tratamiento capilar BRAIMARÚ junto a aceites e ingredientes naturales',
    featured:true, active:true, sortOrder:2, ritualTags:['nutrir','cuidado-capilar'] },
  { id:'shampoo-capilar', name:'Shampoo capilar', slug:'shampoo-capilar', category:'cuidado-capilar',
    shortDescription:'Shampoo de la línea capilar de reparación intensiva y fortalecimiento.',
    benefits:['Cuidado capilar','Fortalecimiento'], priceCop:null,
    image:'/products/shampoo-capilar.webp', imageAlt:'Shampoo capilar BRAIMARÚ en presentación negra con detalles botánicos',
    featured:true, active:true, sortOrder:3, ritualTags:['cuidado-capilar'] },
];
