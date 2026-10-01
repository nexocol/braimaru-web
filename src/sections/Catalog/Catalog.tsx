import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { onCatalogFilter, type CatalogFilter } from '../../lib/catalogBus';
import { useScrollScenes } from '../../lib/motion';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product } from '../../types/catalog';

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

/** Where the advice tile sits in the grid when it is shown (keeps the rhythm of 4/3/2 columns). */
const ADVICE_POSITION = 6;

export function Catalog({ products, phone = null }: CatalogProps) {
  const root = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('all');
  useScrollScenes(root);

  useEffect(() => onCatalogFilter(setActiveFilter), []);

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

  const showAdvice = visibleProducts.length >= ADVICE_POSITION;

  return (
    <section id="catalogo" className="catalog section-shell" aria-labelledby="catalog-title" ref={root}>
      <div className="section-head">
        <div>
          <p className="eyebrow" data-fade>Catálogo</p>
          <h2 id="catalog-title" data-lines>Todo BRAIMARÚ,<br />en un solo lugar.</h2>
        </div>
        <p data-fade data-delay="0.1">
          Abre el producto que te interese y continúa la conversación por WhatsApp. Precios y disponibilidad se confirman por ahí.
        </p>
      </div>

      <div className="catalog-toolbar">
        <div className="catalog-filters" role="group" aria-label="Filtrar catálogo">
          {filters.map((filter) => {
            const count = countFor(filter.id);
            if (filter.id !== 'all' && count === 0) return null;
            return (
              <button
                key={filter.id}
                type="button"
                className={activeFilter === filter.id ? 'is-active' : undefined}
                aria-pressed={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span>{filter.label}</span>
                <small>{String(count).padStart(2, '0')}</small>
              </button>
            );
          })}
        </div>
        <span className="catalog-result-count" aria-live="polite">
          {visibleProducts.length} {visibleProducts.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="catalog-grid">
          {visibleProducts.flatMap((product, index) => {
            const card = <ProductCard key={product.id} product={product} index={index % 8} />;
            if (showAdvice && index === ADVICE_POSITION) {
              return [
                <aside key="advice" className="catalog-advice">
                  <p className="eyebrow">¿No sabes cuál elegir?</p>
                  <h3>Cuéntanos qué buscas y te orientamos.</h3>
                  <a
                    className="button light"
                    href={buildWhatsAppUrl({ phone, message: 'Hola, quiero que me ayuden a elegir un producto de BRAIMARÚ.' })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Escribir por WhatsApp <ArrowIcon />
                  </a>
                </aside>,
                card,
              ];
            }
            return [card];
          })}
      </div>
    </section>
  );
}
