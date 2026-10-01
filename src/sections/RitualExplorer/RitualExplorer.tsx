import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Product, RitualTag } from '../../types/catalog';

interface RitualDefinition {
  id: RitualTag;
  label: string;
  eyebrow: string;
  copy: string;
  image: string;
  imageAlt: string;
  imageFit?: 'cover' | 'contain';
  emptyCopy?: string;
}

const rituals: RitualDefinition[] = [
  {
    id: 'hidratar',
    label: 'Hidratar',
    eyebrow: 'Suavidad + confort',
    copy: 'Una pausa de cuidado para acompañar la piel y devolverle una sensación de confort.',
    image: '/products/catalog/crema-manos-corporal.webp',
    imageAlt: 'Crema de manos y corporal BRAIMARÚ',
    imageFit: 'contain',
  },
  {
    id: 'nutrir',
    label: 'Nutrir',
    eyebrow: 'Cuidado diario',
    copy: 'Texturas y aceites que convierten la rutina en un gesto más consciente.',
    image: '/products/catalog/aceite-cafe-naranja.webp',
    imageAlt: 'Aceite corporal Café y Naranja BRAIMARÚ',
  },
  {
    id: 'exfoliar',
    label: 'Exfoliar',
    eyebrow: 'Renovar + suavizar',
    copy: 'Un gesto de renovación para sumar textura y pausa al ritual corporal.',
    image: '/editorial/exfoliante-cafe-v11.webp',
    imageAlt: 'Línea exfoliante de café BRAIMARÚ',
    emptyCopy: 'Explora la textura exfoliante de la línea BRAIMARÚ.',
  },
  {
    id: 'cuidado-corporal',
    label: 'Cuerpo',
    eyebrow: 'Masaje + bienestar',
    copy: 'Aceites y texturas para transformar la rutina en un momento dedicado a ti.',
    image: '/editorial/cafe-naranja-campaign.webp',
    imageAlt: 'Ritual corporal BRAIMARÚ',
  },
  {
    id: 'cuidado-capilar',
    label: 'Cabello',
    eyebrow: 'Rutina completa',
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
    () => products.filter((product) => product.active && product.ritualTags.includes(active)).slice(0, 3),
    [active, products],
  );

  return (
    <section id="ritual" className="ritual section-shell">
      <div className="ritual-intro">
        <p className="eyebrow">Encuentra tu ritual</p>
        <h2>Una intención.<br />Una forma de cuidarte.</h2>
        <p>Elige lo que quieres sentir hoy y deja que la selección cambie contigo.</p>
      </div>

      <div className="ritual-experience">
        <div className="ritual-tabs" role="tablist" aria-label="Necesidad de cuidado">
          {rituals.map((ritual, index) => (
            <button
              key={ritual.id}
              type="button"
              role="tab"
              aria-selected={active === ritual.id}
              onClick={() => setActive(ritual.id)}
            >
              <span>0{index + 1}</span>
              {ritual.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.figure
            key={active}
            className={`ritual-visual${current.imageFit === 'contain' ? ' ritual-visual--contain' : ''}`}
            initial={{ opacity: 0, clipPath: 'inset(5% 0 5% 0)', scale: 1.01 }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)', scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42 }}
          >
            <img src={current.image} alt={current.imageAlt} loading="lazy" />
          </motion.figure>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-copy`}
            className="ritual-content"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
          >
            <p className="eyebrow">{current.eyebrow}</p>
            <h3>{current.label}</h3>
            <p>{current.copy}</p>
            <div className="ritual-products">
              {matched.length > 0
                ? matched.map((product) => <span key={product.id}>{product.name}</span>)
                : <span>{current.emptyCopy ?? 'Descubre este ritual con BRAIMARÚ.'}</span>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
