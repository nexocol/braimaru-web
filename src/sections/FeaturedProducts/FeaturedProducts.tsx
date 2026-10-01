import { useRef } from 'react';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useScrollScenes } from '../../lib/motion';
import type { Product } from '../../types/catalog';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const root = useRef<HTMLElement>(null);
  useScrollScenes(root);

  const featured = products.filter((product) => product.featured && product.active);
  const [lead, ...secondary] = featured;

  if (!lead) return null;

  return (
    <section id="productos" className="featured section-shell" ref={root}>
      <div className="section-head">
        <div>
          <p className="eyebrow" data-fade>Selección BRAIMARÚ</p>
          <h2 data-lines aria-label="Para empezar, tres favoritos.">Para empezar,<br /><em>tres favoritos.</em></h2>
        </div>
        <p data-fade data-delay="0.1">
          Una entrada rápida al universo de la marca: abre cualquiera y escríbenos por WhatsApp.
        </p>
      </div>

      <div className="featured-layout">
        <ProductCard product={lead} variant="lead" priority animated={false} />
        <div className="featured-stack" data-stagger>
          {secondary.slice(0, 2).map((product) => (
            <ProductCard key={product.id} product={product} variant="row" animated={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
