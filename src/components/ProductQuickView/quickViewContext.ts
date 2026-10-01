import { createContext, useContext } from 'react';
import type { Product } from '../../types/catalog';

interface QuickViewContextValue {
  open: (product: Product) => void;
}

export const QuickViewContext = createContext<QuickViewContextValue>({ open: () => undefined });

export const useQuickView = () => useContext(QuickViewContext);
