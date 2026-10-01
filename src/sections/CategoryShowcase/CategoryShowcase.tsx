import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { hasFinePointer, useScrollScenes } from '../../lib/motion';
import { requestCatalogFilter } from '../../lib/catalogBus';
import type { Product, ProductCategory } from '../../types/catalog';

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
  position: string;
  filter: ProductCategory;
  matches: (product: Product) => boolean;
}

const collections: CollectionDefinition[] = [
  {
    id: 'cuerpo',
    label: 'Cuerpo',
    kicker: 'Aceites + cremas',
    copy: 'Masaje, hidratación y texturas que hacen más agradable el cuidado cotidiano.',
    image: '/products/catalog/aceite-cafe-naranja.webp',
    imageAlt: 'Aceites corporales Café y Naranja BRAIMARÚ',
    position: '50% 34%',
    filter: 'aceites-corporales',
    matches: (product) => product.category === 'aceites-corporales' || product.category === 'cremas-corporales',
  },
  {
    id: 'cabello',
    label: 'Cabello',
    kicker: 'Rutina capilar',
    copy: 'Shampoo, acondicionador y termoprotector pensados para usarse juntos.',
    image: '/editorial/hair-line-v11.webp',
    imageAlt: 'Línea de cuidado capilar BRAIMARÚ',
    position: '70% 50%',
    filter: 'cuidado-capilar',
    matches: (product) => product.category === 'cuidado-capilar',
  },
  {
    id: 'jabones',
    label: 'Jabones',
    kicker: 'Limpieza sensorial',
    copy: 'Aromas y texturas para que la ducha también se sienta como una pausa.',
    image: '/editorial/exfoliante-cafe-v11.webp',
    imageAlt: 'Jabones exfoliantes de café BRAIMARÚ',
    position: '50% 58%',
    filter: 'jabones',
    matches: (product) => product.category === 'jabones',
  },
  {
    id: 'labios',
    label: 'Labios',
    kicker: 'Cuidado labial',
    copy: 'Un gesto pequeño, fácil de llevar contigo y simple de sumar a cualquier rutina.',
    image: '/products/catalog/balsamo-labial.webp',
    imageAlt: 'Bálsamo labial BRAIMARÚ',
    position: '50% 38%',
    filter: 'cuidado-labial',
    matches: (product) => product.category === 'cuidado-labial',
  },
];

export function CategoryShowcase({ products }: CategoryShowcaseProps) {
  const root = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<CollectionId>('cuerpo');
  useScrollScenes(root);

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

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = collections[(index + step + collections.length) % collections.length];
    setActiveId(next.id);
    root.current?.querySelector<HTMLButtonElement>(`[data-collection="${next.id}"]`)?.focus();
  };

  return (
    <section id="colecciones" className="collections section-shell" ref={root}>
      <div className="section-head">
        <div>
          <p className="eyebrow" data-fade>Explora BRAIMARÚ</p>
          <h2 data-lines>Empieza por cómo<br />quieres <em>sentirte.</em></h2>
        </div>
        <p data-fade data-delay="0.1">
          Elige una línea y descubre los productos que mejor encajan con tu momento.
        </p>
      </div>

      <div className="panels" role="group" aria-label="Colecciones BRAIMARÚ" data-fade data-delay="0.12">
        {collections.map((collection, index) => {
          const active = activeId === collection.id;
          const count = counts[collection.id];
          return (
            <article
              key={collection.id}
              className={`panel${active ? ' is-active' : ''}`}
              style={{ '--pos': collection.position } as CSSProperties}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' && hasFinePointer()) setActiveId(collection.id);
              }}
            >
              <img src={collection.image} alt={collection.imageAlt} loading="lazy" decoding="async" />
              <div className="panel-shade" aria-hidden="true" />

              <button
                type="button"
                id={`collection-tab-${collection.id}`}
                data-collection={collection.id}
                className="panel-tab"
                aria-expanded={active}
                aria-controls={`collection-panel-${collection.id}`}
                onClick={() => setActiveId(collection.id)}
                onFocus={() => setActiveId(collection.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span className="sr-only">{collection.label}</span>
              </button>

              <span className="panel-index" aria-hidden="true">0{index + 1}</span>
              <span className="panel-label-v" aria-hidden="true">{collection.label}</span>

              <div className="panel-content">
                <h3 className="panel-label" aria-hidden="true">{collection.label}</h3>
                <div
                  className="panel-extra"
                  id={`collection-panel-${collection.id}`}
                  role="region"
                  aria-labelledby={`collection-tab-${collection.id}`}
                  aria-hidden={!active}
                  inert={!active}
                >
                  <div>
                    <span className="panel-kicker">{collection.kicker}</span>
                    <p>{collection.copy}</p>
                    <a
                      className="panel-link"
                      href="#catalogo"
                      onClick={() => requestCatalogFilter(collection.filter)}
                    >
                      Ver {count} {count === 1 ? 'producto' : 'productos'} <ArrowIcon />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
