import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { Product, ProductCategory } from '../../types/catalog';

type CatalogFilter = 'all' | ProductCategory;

const filters: Array<{ id: CatalogFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'aceites-corporales', label: 'Aceites corporales' },
  { id: 'cuidado-capilar', label: 'Cuidado capilar' },
];

interface CatalogProps {
  products: Product[];
  phone?: string | null;
}

export function Catalog({ products, phone = null }: CatalogProps) {
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');

  const visibleProducts = useMemo(
    () =>
      products
        .filter((product) => product.active)
        .filter((product) => activeFilter === 'all' || product.category === activeFilter)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [activeFilter, products],
  );

  return (
    <section className="catalog section-shell" aria-labelledby="catalog-title">
      <div className="section-heading catalog-heading">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h2 id="catalog-title">Elige tu próximo ritual.</h2>
        </div>
        <p>Explora la selección disponible y consulta cada producto directamente por WhatsApp.</p>
      </div>

      <div className="catalog-filters" aria-label="Filtrar catálogo">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={activeFilter === filter.id ? 'is-active' : undefined}
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <motion.div className="catalog-grid" layout>
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} phone={phone} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
