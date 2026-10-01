import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { ProductQuickView } from '../../components/ProductQuickView/ProductQuickView';
import type { Product, ProductCategory } from '../../types/catalog';

type CatalogFilter = 'all' | ProductCategory;

const filters: Array<{ id: CatalogFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'aceites-corporales', label: 'Aceites' },
  { id: 'cuidado-capilar', label: 'Cabello' },
  { id: 'jabones', label: 'Jabones' },
  { id: 'cremas-corporales', label: 'Cremas' },
  { id: 'cuidado-labial', label: 'Labios' },
];

interface CatalogProps {
  products: Product[];
  phone?: string | null;
}

export function Catalog({ products, phone = null }: CatalogProps) {
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeProducts = useMemo(
    () => products.filter((product) => product.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [products],
  );

  const visibleProducts = useMemo(
    () => activeProducts.filter((product) => activeFilter === 'all' || product.category === activeFilter),
    [activeFilter, activeProducts],
  );

  const countFor = (filter: CatalogFilter) =>
    filter === 'all' ? activeProducts.length : activeProducts.filter((product) => product.category === filter).length;

  return (
    <section id="catalogo" className="catalog section-shell" aria-labelledby="catalog-title">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h2 id="catalog-title">Todo BRAIMARÚ,<br />sin perder el ritmo.</h2>
        </div>
        <p>Explora rápido, abre el producto que te interese y continúa la conversación por WhatsApp.</p>
      </div>

      <div className="catalog-toolbar">
        <div className="catalog-filters" aria-label="Filtrar catálogo">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={activeFilter === filter.id ? 'is-active' : undefined}
              aria-pressed={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span>{filter.label}</span>
              <small>{String(countFor(filter.id)).padStart(2, '0')}</small>
            </button>
          ))}
        </div>
        <span className="catalog-result-count">{visibleProducts.length} productos</span>
      </div>

      <motion.div className="catalog-grid" layout>
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              phone={phone}
              onOpen={setSelectedProduct}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <ProductQuickView product={selectedProduct} phone={phone} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
