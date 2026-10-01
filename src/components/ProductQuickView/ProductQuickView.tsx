import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { artStyle } from '../../data/artDirection';
import { formatCopPrice } from '../../lib/format/price';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product } from '../../types/catalog';
import { ArrowIcon } from '../ArrowIcon/ArrowIcon';

interface ProductQuickViewProps {
  product: Product | null;
  phone?: string | null;
  onClose: () => void;
}

const CATEGORY_LABEL: Record<Product['category'], string> = {
  'aceites-corporales': 'Aceites corporales',
  'cuidado-capilar': 'Cuidado capilar',
  jabones: 'Jabones',
  'cremas-corporales': 'Cremas corporales',
  'cuidado-labial': 'Cuidado labial',
};

function displayDescription(product: Product) {
  if (product.id === 'shampoo-capilar') return 'Shampoo capilar BRAIMARÚ.';
  if (product.id === 'acondicionador-capilar') return 'Acondicionador capilar BRAIMARÚ.';
  return product.description || product.shortDescription;
}

export function ProductQuickView({ product, phone = null, onClose }: ProductQuickViewProps) {
  const [failedId, setFailedId] = useState<string | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const imageFailed = Boolean(product && failedId === product.id);

  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialog.current) return;

      // keep keyboard focus inside the dialog
      const focusable = dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, product]);

  const price = product ? formatCopPrice(product.priceCop) : null;

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
          transition={{ duration: 0.22 }}
        >
          <motion.div
            ref={dialog}
            className="quickview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickview-title"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <button ref={closeButton} className="quickview-close" type="button" onClick={onClose} aria-label="Cerrar detalle">
              <span />
              <span />
            </button>

            <div
              className="quickview-media media-stage"
              style={product.image && !imageFailed ? ({ ...artStyle(product.image), '--stage-img': `url("${product.image}")` } as CSSProperties) : undefined}
            >
              {product.image && !imageFailed ? (
                <img src={product.image} alt={product.imageAlt} onError={() => setFailedId(product.id)} />
              ) : (
                <div className="product-media-brand" role="img" aria-label={`BRAIMARÚ — ${product.name}`}>
                  <img src="/brand/braimaru-logo-premium.png" alt="" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="quickview-copy">
              <p className="eyebrow">{CATEGORY_LABEL[product.category]}</p>
              <h2 id="quickview-title">{product.name}</h2>
              <p className="quickview-description">{displayDescription(product)}</p>

              {product.benefits.length > 0 ? (
                <ul className="quickview-benefits" aria-label={`Beneficios de ${product.name}`}>
                  {product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                </ul>
              ) : null}

              <div className="quickview-footer">
                <p className="quickview-price">
                  {price ?? 'Precio y disponibilidad por WhatsApp'}
                </p>
                <a
                  className="button primary"
                  href={buildWhatsAppUrl({ phone, productName: product.name })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Pedir por WhatsApp <ArrowIcon />
                </a>
                <button className="text-link" type="button" onClick={onClose}>
                  Seguir explorando
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
