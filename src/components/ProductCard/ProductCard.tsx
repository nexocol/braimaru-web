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
}

const CONTAINED_ARTWORK_PRODUCTS = new Set([
  'jabon-exfoliante-cafe',
  'jabon-avena-aclarante',
  'jabon-avena-miel',
  'jabon-canela-clavos',
  'jabon-manzana-verde',
]);

export function ProductCard({
  product,
  phone = null,
  priority = false,
  variant = 'default',
}: ProductCardProps) {
  const formattedPrice = formatCopPrice(product.priceCop);
  const [imageFailed, setImageFailed] = useState(false);
  const containedArtwork = CONTAINED_ARTWORK_PRODUCTS.has(product.id);

  useEffect(() => {
    setImageFailed(false);
  }, [product.image]);

  return (
    <motion.article
      className={`product-card product-card--${variant}`}
      data-product-id={product.id}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      layout
    >
      <div className={`product-media${containedArtwork ? ' product-media--contain' : ''}`}>
        {product.image && !imageFailed ? (
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
        )}
      </div>

      <div className="product-meta">
        <p className="eyebrow">{product.category.replaceAll('-', ' ')}</p>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>

        {product.benefits.length > 0 ? (
          <ul className="product-benefits" aria-label={`Beneficios de ${product.name}`}>
            {product.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        ) : null}

        <div className="product-actions">
          <span className="price-pending">{formattedPrice ?? 'Consultar precio'}</span>
          <a
            className="text-link"
            href={buildWhatsAppUrl({ phone, productName: product.name })}
            target="_blank"
            rel="noreferrer"
          >
            Pedir por WhatsApp <ArrowIcon />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
