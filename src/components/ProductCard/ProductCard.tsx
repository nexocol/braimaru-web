import { useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { artStyle } from '../../data/artDirection';
import { formatCopPrice } from '../../lib/format/price';
import type { Product } from '../../types/catalog';
import { ArrowIcon } from '../ArrowIcon/ArrowIcon';
import { useQuickView } from '../ProductQuickView/quickViewContext';

type ProductCardVariant = 'default' | 'lead' | 'row';

interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  priority?: boolean;
  /** position in the grid, used for the staggered entrance */
  index?: number;
  animated?: boolean;
}

const CATEGORY_LABEL: Record<Product['category'], string> = {
  'aceites-corporales': 'Aceite corporal',
  'cuidado-capilar': 'Cuidado capilar',
  jabones: 'Jabón',
  'cremas-corporales': 'Crema',
  'cuidado-labial': 'Labios',
};

function getDisplayDescription(product: Product) {
  if (product.id === 'shampoo-capilar') return 'Shampoo capilar BRAIMARÚ.';
  if (product.id === 'acondicionador-capilar') return 'Acondicionador capilar BRAIMARÚ.';
  return product.shortDescription;
}

export function ProductCard({ product, variant = 'default', priority = false, index = 0, animated = true }: ProductCardProps) {
  const { open } = useQuickView();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageFailed = failedImage === product.image;
  const price = formatCopPrice(product.priceCop);
  const hasImage = Boolean(product.image) && !imageFailed;
  const contained = hasImage && artStyle(product.image)['--ad-fit'] === 'contain';

  const body = (
    <>
      <div
        className={`product-media${contained ? ' product-media--contain' : ''}`}
        style={hasImage ? artStyle(product.image) : undefined}
      >
        {hasImage ? (
          <img
            src={product.image ?? undefined}
            alt={product.imageAlt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width="780"
            height="975"
            onError={() => setFailedImage(product.image)}
          />
        ) : (
          <div className="product-media-brand" role="img" aria-label={`BRAIMARÚ — ${product.name}`}>
            <img src="/brand/braimaru-logo-premium.png" alt="" aria-hidden="true" />
          </div>
        )}
        <span className="product-media-action" aria-hidden="true">Ver detalle</span>
      </div>

      <div className="product-meta">
        <p className="eyebrow">{CATEGORY_LABEL[product.category]}</p>
        <h3>
          <button className="product-open" type="button" onClick={() => open(product)}>
            {product.name}
            <span className="sr-only">: ver detalle</span>
          </button>
        </h3>

        {variant === 'lead' ? <p className="product-description">{getDisplayDescription(product)}</p> : null}

        {variant === 'lead' && product.benefits.length > 0 ? (
          <ul className="product-benefits" aria-label={`Beneficios de ${product.name}`}>
            {product.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        ) : null}

        <span className="product-cta">
          {price ?? 'Ver detalle'} <ArrowIcon />
        </span>
      </div>
    </>
  );

  const className = `product-card product-card--${variant}`;

  if (!animated) {
    return <article className={className} data-product-id={product.id}>{body}</article>;
  }

  return (
    <motion.article
      className={className}
      data-product-id={product.id}
      style={{ '--i': index } as CSSProperties}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      layout="position"
    >
      {body}
    </motion.article>
  );
}
