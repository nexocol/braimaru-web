import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Product } from '../../types/catalog';

interface CategoryShowcaseProps {
  products: Product[];
}

type CollectionId = 'cuerpo' | 'cabello' | 'jabones' | 'labios';

interface CollectionDefinition {
  id: CollectionId;
  label: string;
  kicker: string;
  copy: string;
  image: string;
  imageAlt: string;
  matches: (product: Product) => boolean;
}

const collections: CollectionDefinition[] = [
  {
    id: 'cuerpo',
    label: 'Cuerpo',
    kicker: 'Aceites + cremas',
    copy: 'Texturas cálidas para masaje, hidratación y cuidado diario.',
    image: '/editorial/cafe-naranja-campaign.webp',
    imageAlt: 'Aceite corporal Café y Naranja BRAIMARÚ',
    matches: (product) => product.category === 'aceites-corporales' || product.category === 'cremas-corporales',
  },
  {
    id: 'cabello',
    label: 'Cabello',
    kicker: 'Rutina capilar',
    copy: 'Limpieza, suavidad y protección dentro de un mismo ritual.',
    image: '/editorial/hair-line-v11.webp',
    imageAlt: 'Línea de cuidado capilar BRAIMARÚ',
    matches: (product) => product.category === 'cuidado-capilar',
  },
  {
    id: 'jabones',
    label: 'Jabones',
    kicker: 'Limpieza sensorial',
    copy: 'Ingredientes, texturas y aromas para renovar el cuidado corporal.',
    image: '/products/catalog/jabon-exfoliante-cafe.webp',
    imageAlt: 'Jabón exfoliante de café BRAIMARÚ',
    matches: (product) => product.category === 'jabones',
  },
  {
    id: 'labios',
    label: 'Labios',
    kicker: 'Hidratación',
    copy: 'Un gesto pequeño para mantener el cuidado cerca durante el día.',
    image: '/products/catalog/balsamo-labial.webp',
    imageAlt: 'Bálsamo labial BRAIMARÚ',
    matches: (product) => product.category === 'cuidado-labial',
  },
];

export function CategoryShowcase({ products }: CategoryShowcaseProps) {
  const [activeId, setActiveId] = useState<CollectionId>('cuerpo');
  const active = collections.find((collection) => collection.id === activeId) ?? collections[0];

  const counts = useMemo(
    () =>
      Object.fromEntries(
        collections.map((collection) => [
          collection.id,
          products.filter((product) => product.active && collection.matches(product)).length,
        ]),
      ) as Record<CollectionId, number>,
    [products],
  );

  return (
    <section id="colecciones" className="collections section-shell">
      <div className="collections-heading">
        <div>
          <p className="eyebrow">Explora BRAIMARÚ</p>
          <h2>Elige por universo,<br />no por catálogo.</h2>
        </div>
        <p>Cuatro formas de entrar a la marca según el momento de cuidado que quieres construir.</p>
      </div>

      <div className="collections-stage">
        <div className="collections-list" role="tablist" aria-label="Colecciones BRAIMARÚ">
          {collections.map((collection, index) => (
            <button
              key={collection.id}
              type="button"
              role="tab"
              aria-selected={activeId === collection.id}
              onMouseEnter={() => setActiveId(collection.id)}
              onFocus={() => setActiveId(collection.id)}
              onClick={() => setActiveId(collection.id)}
            >
              <span className="collections-index">0{index + 1}</span>
              <span className="collections-label">{collection.label}</span>
              <span className="collections-count">{counts[collection.id]} productos</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.figure
            key={active.id}
            className="collections-visual"
            initial={{ opacity: 0, clipPath: 'inset(4% 0 4% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42 }}
          >
            <img src={active.image} alt={active.imageAlt} loading="lazy" />
            <figcaption>
              <span>{active.kicker}</span>
              <p>{active.copy}</p>
              <a href="#catalogo">Ver productos</a>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
    </section>
  );
}
