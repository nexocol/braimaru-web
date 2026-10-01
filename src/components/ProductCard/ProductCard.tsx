import { useState } from 'react';
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

export function ProductCard({
  product,
  phone = null,
  priority = false,
  variant = 'default',
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const formattedPrice = formatCopPrice(product.priceCop);

  return (
    <motion.article
      className={`product-card product-card--${variant}`}
      initial={{ opacity: 1, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      layout
    >
      <div className="product-media">
        {product.image && !imageFailed ? (
          <img
            src={product.image}
            alt={product.imageAlt}
            loading="eager"
            width="780"
            height="900"
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="product-media-brand" aria-hidden="true">
            <span>BRAIMARÚ</span>
          </div>
        )}
      </div>

      <div className="product-meta">
        <p className="eyebrow">{product.category.replaceAll('-', ' ')}</p>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>

        <ul className="product-benefits" aria-label={`Beneficios de ${product.name}`}>
          {product.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>

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
