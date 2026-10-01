import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Product } from '../../types/catalog';
import { ProductQuickView } from './ProductQuickView';
import { QuickViewContext } from './quickViewContext';

interface QuickViewProviderProps {
  phone?: string | null;
  children: ReactNode;
}

/** One Quick View for the whole storefront (featured, ritual, catalog, hero all open the same dialog). */
export function QuickViewProvider({ phone = null, children }: QuickViewProviderProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const open = useCallback((next: Product) => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setProduct(next);
  }, []);

  const close = useCallback(() => {
    setProduct(null);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <ProductQuickView product={product} phone={phone} onClose={close} />
    </QuickViewContext.Provider>
  );
}
