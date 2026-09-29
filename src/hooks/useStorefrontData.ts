import { useEffect, useState } from 'react';
import type { Category, Product } from '../types/catalog';
import { loadStorefrontData } from '../lib/api/storefront';
import type { SiteSettings } from '../lib/api/types';

interface StorefrontState {
  products: Product[];
  categories: Category[];
  site: SiteSettings;
  source: 'api' | 'fixtures' | null;
  warning: string | null;
  loading: boolean;
  error: string | null;
}

const EMPTY_SITE: SiteSettings = {
  whatsapp_phone: null,
  instagram_url: null,
  brand_email: null,
};

export function useStorefrontData() {
  const [state, setState] = useState<StorefrontState>({
    products: [],
    categories: [],
    site: EMPTY_SITE,
    source: null,
    warning: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    loadStorefrontData()
      .then((data) => {
        if (cancelled) return;
        setState({
          ...data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('[BRAIMARÚ] Storefront data failed.', error);
        setState((current) => ({
          ...current,
          loading: false,
          error: 'No pudimos cargar la selección en este momento.',
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
