import { motion } from 'motion/react';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product } from '../../types/catalog';
import { ArrowIcon } from '../ArrowIcon/ArrowIcon';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <motion.article className="product-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
      {product.image ? (
        <div className="product-media">
          <img src={product.image} alt={product.imageAlt} loading={priority ? 'eager' : 'lazy'} width="780" height="900" />
        </div>
      ) : (
        <div className="product-media product-media-neutral" role="img" aria-label={`${product.name}: fotografía individual pendiente de confirmar`}>
          <span className="neutral-brand">BRAIMARÚ</span>
          <span className="neutral-note">Fotografía individual pendiente</span>
        </div>
      )}
      <div className="product-meta">
        <p className="eyebrow">{product.category.replaceAll('-', ' ')}</p>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="product-actions">
          <span className="price-pending">Precio por WhatsApp</span>
          <a className="text-link" href={buildWhatsAppUrl({ productName: product.name })} target="_blank" rel="noreferrer">
            Consultar <ArrowIcon />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
