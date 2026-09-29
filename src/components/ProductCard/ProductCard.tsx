import { motion } from 'motion/react';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product } from '../../types/catalog';
import { ArrowIcon } from '../ArrowIcon/ArrowIcon';

type ProductCardVariant = 'default' | 'editorial' | 'compact';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  variant?: ProductCardVariant;
}

export function ProductCard({ product, priority = false, variant = 'default' }: ProductCardProps) {
  return (
    <motion.article
      className={`product-card product-card--${variant}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
      layout
    >
      <div className="product-media">
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt}
            loading={priority ? 'eager' : 'lazy'}
            width="780"
            height="900"
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
          <span className="price-pending">Consultar precio</span>
          <a
            className="text-link"
            href={buildWhatsAppUrl({ productName: product.name })}
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
