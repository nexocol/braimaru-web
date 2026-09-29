import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { Product } from '../../types/catalog';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.filter((product) => product.featured && product.active);

  return (
    <section id="productos" className="products-section section-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Selección BRAIMARÚ</p>
          <h2>Cuida lo que habitas.</h2>
        </div>
        <p>Una primera selección construida únicamente con productos identificados en el material original de la marca.</p>
      </div>

      <div className="product-grid">
        {featured.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}
