import type { ProductCategory } from '../types/catalog';

export type CatalogFilter = 'all' | ProductCategory;

const EVENT = 'braimaru:catalog-filter';

/** Lets other sections (collections, hero chips, ritual) pre-select a catalog filter. */
export function requestCatalogFilter(filter: CatalogFilter) {
  window.dispatchEvent(new CustomEvent<CatalogFilter>(EVENT, { detail: filter }));
}

export function onCatalogFilter(handler: (filter: CatalogFilter) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<CatalogFilter>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
