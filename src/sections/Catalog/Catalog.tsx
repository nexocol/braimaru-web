import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { Product } from '../../types/catalog';

interface CatalogProps {
  products: Product[];
}

export function Catalog({ products }: CatalogProps) {
  const activeProducts = products.filter((product) => product.active);

  return (
    <section className="catalog section-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catálogo visual</p>
          <h2>Rituales para cuerpo y cabello.</h2>
        </div>
        <p>La V1 utiliza fixtures tipados respaldados por el material entregado; la fuente de datos podrá cambiar a D1 sin rehacer estos componentes.</p>
      </div>
      <div className="catalog-grid">
        {activeProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
