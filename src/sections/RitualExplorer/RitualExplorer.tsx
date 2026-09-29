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
    copy: 'Suavidad y cuidado para acompañar el cabello después de la limpieza.',
    image: '/products/acondicionador-capilar-v11.webp',
    imageAlt: 'Acondicionador capilar BRAIMARÚ',
  },
  {
    id: 'nutrir',
    label: 'Nutrir',
    copy: 'Un gesto de cuidado capilar con ortiga, manzanilla y canela.',
    image: '/products/shampoo-capilar-v11.webp',
    imageAlt: 'Shampoo capilar BRAIMARÚ',
  },
  {
    id: 'exfoliar',
    label: 'Exfoliar',
    copy: 'Una textura distinta para renovar el ritual de cuidado corporal.',
    image: '/editorial/exfoliante-cafe-v11.webp',
    imageAlt: 'Detalle de la línea exfoliante de café BRAIMARÚ',
    emptyCopy: 'Explora la textura exfoliante de la línea BRAIMARÚ.',
  },
  {
    id: 'cuidado-corporal',
    label: 'Cuidado corporal',
    copy: 'Aromas cálidos para acompañar un momento de cuidado propio.',
    image: '/products/aceite-corporal-01.webp',
    imageAlt: 'Aceite corporal BRAIMARÚ de canela y clavos de olor',
  },
  {
    id: 'cuidado-capilar',
    label: 'Cuidado capilar',
    copy: 'Shampoo, acondicionador y termoprotector dentro de una misma línea de cuidado.',
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
