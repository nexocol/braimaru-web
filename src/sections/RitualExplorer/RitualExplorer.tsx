import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Product, RitualTag } from '../../types/catalog';

interface RitualDefinition {
  id: RitualTag;
  label: string;
  copy: string;
  image: string | null;
}

const rituals: RitualDefinition[] = [
  { id: 'hidratar', label: 'Hidratar', copy: 'El acondicionador identifica “Hidrata” entre sus beneficios visibles.', image: null },
  { id: 'nutrir', label: 'Nutrir', copy: 'El shampoo identifica “Nutre” entre sus beneficios visibles.', image: null },
  { id: 'exfoliar', label: 'Exfoliar', copy: 'Todavía no asociamos un producto a esta necesidad en la V1.', image: null },
  { id: 'cuidado-corporal', label: 'Cuidado corporal', copy: 'Aceite corporal de canela y clavos de olor identificado en el material original.', image: '/products/aceite-corporal-01.webp' },
  { id: 'cuidado-capilar', label: 'Cuidado capilar', copy: 'Shampoo y acondicionador identificados en la línea capilar BRAIMARÚ.', image: null },
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
        <p>Explora por intención. Cada asociación mostrada se limita a beneficios o categorías visibles en los assets recibidos.</p>
      </div>

      <div className="ritual-tabs" role="tablist" aria-label="Necesidad de cuidado">
        {rituals.map((ritual) => (
          <button key={ritual.id} type="button" role="tab" aria-selected={active === ritual.id} onClick={() => setActive(ritual.id)}>
            {ritual.label}
          </button>
        ))}
      </div>

      <div className="ritual-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className={current.image ? 'ritual-image' : 'ritual-image ritual-image-neutral'}
            initial={{ opacity: 0, clipPath: 'inset(8% 0 8% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {current.image ? (
              <img src={current.image} alt="" loading="lazy" />
            ) : (
              <>
                <span className="neutral-brand">BRAIMARÚ</span>
                <span className="neutral-note">Visual específico pendiente de respaldo</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="ritual-content">
          <span className="ritual-number">0{rituals.findIndex((ritual) => ritual.id === active) + 1}</span>
          <h3>{current.label}</h3>
          <p>{current.copy}</p>
          <div className="ritual-products">
            {matched.length > 0 ? matched.map((product) => <span key={product.id}>{product.name}</span>) : <span>Sin producto asociado por ahora</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
