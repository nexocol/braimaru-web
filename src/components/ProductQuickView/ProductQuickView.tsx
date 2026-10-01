import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { formatCopPrice } from '../../lib/format/price';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product } from '../../types/catalog';
import { ArrowIcon } from '../ArrowIcon/ArrowIcon';

interface ProductQuickViewProps {
  product: Product | null;
  phone?: string | null;
  onClose: () => void;
}

function displayDescription(product: Product) {
  if (product.id === 'shampoo-capilar') return 'Shampoo capilar BRAIMARÚ.';
  if (product.id === 'acondicionador-capilar') return 'Acondicionador capilar BRAIMARÚ.';
  return product.description || product.shortDescription;
}

export function ProductQuickView({ product, phone = null, onClose }: ProductQuickViewProps) {
  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, product]);

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="quickview-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="quickview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickview-title"
            initial={{ opacity: 0, y: 30, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.36 }}
          >
            <button className="quickview-close" type="button" onClick={onClose} aria-label="Cerrar detalle">
              <span />
              <span />
            </button>

            <div className="quickview-media">
              {product.image ? <img src={product.image} alt={product.imageAlt} /> : <div className="product-media-brand"><span>BM</span></div>}
            </div>

            <div className="quickview-copy">
              <p className="eyebrow">{product.category.replaceAll('-', ' ')}</p>
              <h2 id="quickview-title">{product.name}</h2>
              <p>{displayDescription(product)}</p>

              {product.benefits.length > 0 ? (
                <ul className="quickview-benefits">
                  {product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                </ul>
              ) : null}

              <div className="quickview-footer">
                <span>{formatCopPrice(product.priceCop) ?? 'Consultar precio'}</span>
                <a
                  className="button primary"
                  href={buildWhatsAppUrl({ phone, productName: product.name })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Pedir por WhatsApp <ArrowIcon />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
