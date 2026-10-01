import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { formatCopPrice } from '../../lib/format/price';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product } from '../../types/catalog';
import { ArrowIcon } from '../ArrowIcon/ArrowIcon';

type ProductCardVariant = 'default' | 'editorial' | 'compact';

interface ProductCardProps {
  product: Product;
  phone?: string | null;
  priority?: boolean;
  variant?: ProductCardVariant;
  onOpen?: (product: Product) => void;
}

const CONTAINED_ARTWORK_PRODUCTS = new Set([
  'jabon-avena-miel',
  'jabon-manzana-verde',
]);

function getDisplayDescription(product: Product) {
  if (product.id === 'shampoo-capilar') return 'Shampoo capilar BRAIMARÚ.';
  if (product.id === 'acondicionador-capilar') return 'Acondicionador capilar BRAIMARÚ.';
  return product.shortDescription;
}

export function ProductCard({
  product,
  phone = null,
  priority = false,
  variant = 'default',
  onOpen,
}: ProductCardProps) {
  const formattedPrice = formatCopPrice(product.priceCop);
  const [imageFailed, setImageFailed] = useState(false);
  const containedArtwork = CONTAINED_ARTWORK_PRODUCTS.has(product.id);
  const showExtendedCopy = variant === 'editorial';

  useEffect(() => {
    setImageFailed(false);
  }, [product.image]);

  const media = product.image && !imageFailed ? (
    <img
      src={product.image}
      alt={product.imageAlt}
      loading={priority ? 'eager' : 'lazy'}
      width="780"
      height="900"
      onError={() => setImageFailed(true)}
    />
  ) : (
    <div className="product-media-brand" role="img" aria-label={`BRAIMARÚ — ${product.name}`}>
      <span className="product-media-monogram">BM</span>
      <small>BRAIMARÚ</small>
    </div>
  );

  return (
    <motion.article
      className={`product-card product-card--${variant}`}
      data-product-id={product.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      layout
    >
      <div className={`product-media${containedArtwork ? ' product-media--contain' : ''}`}>
        {onOpen ? (
          <button
            className="product-media-button"
            type="button"
            onClick={() => onOpen(product)}
            aria-label={`Ver detalles de ${product.name}`}
          >
            {media}
            <span className="product-media-action">Ver detalle</span>
          </button>
        ) : media}
      </div>

      <div className="product-meta">
        <p className="eyebrow">{product.category.replaceAll('-', ' ')}</p>
        <h3>{product.name}</h3>

        {showExtendedCopy ? <p>{getDisplayDescription(product)}</p> : null}

        {showExtendedCopy && product.benefits.length > 0 ? (
          <ul className="product-benefits" aria-label={`Beneficios de ${product.name}`}>
            {product.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        ) : null}

        <div className="product-actions">
          <span className="price-pending">{formattedPrice ?? 'Consultar precio'}</span>
          {onOpen ? (
            <button className="text-link product-open" type="button" onClick={() => onOpen(product)}>
              Ver detalle <ArrowIcon />
            </button>
          ) : (
            <a
              className="text-link"
              href={buildWhatsAppUrl({ phone, productName: product.name })}
              target="_blank"
              rel="noreferrer"
            >
              Consultar <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
