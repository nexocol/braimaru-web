import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Product, RitualTag } from '../../types/catalog';

interface RitualDefinition {
  id: RitualTag;
  label: string;
  copy: string;
  image: string;
  imageAlt: string;
  emptyCopy?: string;
}

const rituals: RitualDefinition[] = [
  {
    id: 'hidratar',
    label: 'Hidratar',
    copy: 'Una pausa de cuidado para acompañar la piel y devolverle una sensación de confort.',
    image: '/products/catalog/crema-manos-corporal.webp',
    imageAlt: 'Crema de manos y corporal BRAIMARÚ',
  },
  {
    id: 'nutrir',
    label: 'Nutrir',
    copy: 'Texturas y aceites que convierten el cuidado diario en un gesto más consciente.',
    image: '/products/catalog/aceite-cafe-naranja.webp',
    imageAlt: 'Aceite corporal Café y Naranja BRAIMARÚ',
  },
  {
    id: 'exfoliar',
    label: 'Exfoliar',
    copy: 'Un gesto de renovación para sumar textura y pausa al ritual corporal.',
    image: '/editorial/exfoliante-cafe-v11.webp',
    imageAlt: 'Detalle de la línea exfoliante de café BRAIMARÚ',
    emptyCopy: 'Explora la textura exfoliante de la línea BRAIMARÚ.',
  },
  {
    id: 'cuidado-corporal',
    label: 'Cuidado corporal',
    copy: 'Aceites y texturas para transformar la rutina en un momento dedicado a ti.',
    image: '/products/catalog/aceite-naranja-calendula.webp',
    imageAlt: 'Aceite corporal Caléndula y Naranja BRAIMARÚ',
  },
  {
    id: 'cuidado-capilar',
    label: 'Cuidado capilar',
    copy: 'Shampoo, acondicionador y termoprotector reunidos dentro de un mismo lenguaje de cuidado.',
    image: '/editorial/hair-line-v11.webp',
    imageAlt: 'Línea capilar BRAIMARÚ',
  },
];

interface RitualExplorerProps {
  products: Product[];
}

export function RitualExplorer({ products }: RitualExplorerProps) {
  const [active, setActive] = useState<RitualTag>('cuidado-corporal');
  const current = rituals.find((ritual) => ritual.id === active) ?? rituals[0];
  const matched = useMemo(
    () => products.filter((product) => product.ritualTags.includes(active)).slice(0, 3),
    [active, products],
  );

  return (
    <section id="ritual" className="ritual section-shell">
      <div className="ritual-top">
        <div>
          <p className="eyebrow">Encuentra tu ritual</p>
          <h2>¿Qué necesita tu momento de cuidado?</h2>
        </div>
        <p>
          Empieza por una intención y descubre una forma distinta de acercarte a la selección
          BRAIMARÚ.
        </p>
      </div>

      <div className="ritual-tabs" role="tablist" aria-label="Necesidad de cuidado">
        {rituals.map((ritual) => (
          <button
            key={ritual.id}
            type="button"
            role="tab"
            aria-selected={active === ritual.id}
            onClick={() => setActive(ritual.id)}
          >
            {ritual.label}
          </button>
        ))}
      </div>

      <div className="ritual-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="ritual-image"
            initial={{ opacity: 0, clipPath: 'inset(7% 0 7% 0)', scale: 1.015 }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)', scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={current.image} alt={current.imageAlt} loading="lazy" />
          </motion.div>
        </AnimatePresence>

        <div className="ritual-content">
          <span className="ritual-number">
            0{rituals.findIndex((ritual) => ritual.id === active) + 1}
          </span>
          <h3>{current.label}</h3>
          <p>{current.copy}</p>
          <div className="ritual-products">
            {matched.length > 0
              ? matched.map((product) => <span key={product.id}>{product.name}</span>)
              : <span>{current.emptyCopy ?? 'Descubre este ritual con BRAIMARÚ.'}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
