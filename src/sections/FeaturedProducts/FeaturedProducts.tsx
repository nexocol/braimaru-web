import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { Product } from '../../types/catalog';

interface FeaturedProductsProps {
  products: Product[];
  phone?: string | null;
}

export function FeaturedProducts({ products, phone = null }: FeaturedProductsProps) {
  const featured = products.filter((product) => product.featured && product.active);
  const [lead, ...secondary] = featured;

  return (
    <section id="productos" className="products-section section-shell">
      <div className="section-heading featured-heading">
        <div>
          <p className="eyebrow">Selección BRAIMARÚ</p>
          <h2>Cuida lo que habitas.</h2>
        </div>
        <p>
          Cuerpo y cabello se encuentran en una selección pensada para hacer del cuidado diario un
          ritual propio.
        </p>
      </div>

      <div className="featured-layout">
        {lead ? <ProductCard product={lead} phone={phone} priority variant="editorial" /> : null}
        <div className="featured-stack">
          {secondary.map((product) => (
            <ProductCard key={product.id} product={product} phone={phone} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
