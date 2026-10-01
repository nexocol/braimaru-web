import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { Product } from '../../types/catalog';

interface FeaturedProductsProps {
  products: Product[];
  phone?: string | null;
}

export function FeaturedProducts({ products, phone = null }: FeaturedProductsProps) {
  const featured = products.filter((product) => product.featured && product.active);
  const [lead, ...secondary] = featured;

  if (!lead) return null;

  return (
    <section id="productos" className="featured section-shell">
      <div className="featured-heading">
        <div>
          <p className="eyebrow">Selección BRAIMARÚ</p>
          <h2>Favoritos para empezar.</h2>
        </div>
        <p>Una selección breve para descubrir la marca sin convertir la experiencia en una lista interminable.</p>
      </div>

      <div className="featured-layout">
        <ProductCard product={lead} phone={phone} priority variant="editorial" />
        <div className="featured-stack">
          {secondary.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} phone={phone} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
