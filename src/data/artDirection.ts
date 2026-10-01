/**
 * Art direction per photo. Each client photo is framed individually instead of
 * relying on `object-fit: cover` + center: some need to be zoomed to hide baked-in
 * text fragments, some are label artwork that must never be cropped.
 * Keys are file basenames so they also match when the API returns the same file names.
 */
export interface ArtDirection {
  fit?: 'cover' | 'contain';
  position?: string;
  /** zoom applied with the CSS `scale` property (composes with hover / parallax transforms) */
  scale?: number;
  origin?: string;
}

const DEFAULT: ArtDirection = { fit: 'cover', position: '50% 50%', scale: 1 };

const MAP: Record<string, ArtDirection> = {
  // oil bottle: the source has a cream strip and stray text fragments on the left
  'aceite-canela-clavos-v2.webp': { position: '50% 46%' },
  // legacy source (still served by older catalog rows): crop away the cream strip + stray text
  'aceite-corporal-01.webp': { position: '80% 52%', scale: 1.38, origin: '80% 54%' },
  'aceite-cafe-naranja.webp': { position: '50% 38%' },
  // baked-in ingredient infographic painted out of the wall (unconfirmed claims); both caps stay in frame
  'aceite-naranja-calendula.webp': { position: '50% 20%' },
  // both bottles were re-framed (clean wall, no cream strip); no extra zoom needed
  'shampoo-capilar-v11.webp': { position: '50% 50%' },
  'acondicionador-capilar-v11.webp': { position: '30% 52%' },
  'termoprotector-capilar.webp': { position: '50% 46%' },
  // soap on gold: "IDEAL PARA:" fragment lives at the very bottom of the source
  'jabon-canela-clavos.webp': { position: '50% 22%', scale: 1.22, origin: '50% 24%' },
  'jabon-exfoliante-cafe.webp': { position: '50% 55%' },
  'jabon-maracuya.webp': { position: '50% 50%' },
  'jabon-avena-aclarante.webp': { position: '50% 50%' },
  'jabon-coco.webp': { position: '50% 50%' },
  'crema-manos-corporal.webp': { position: '50% 50%' },
  'balsamo-labial.webp': { position: '50% 40%' },
  // label artwork: must be shown whole
  'jabon-avena-miel.webp': { fit: 'contain', position: '50% 50%' },
  'jabon-manzana-verde.webp': { fit: 'contain', position: '50% 50%' },
  // editorial (landscape)
  'family-v11.webp': { position: '52% 50%' },
  'hair-line-v11.webp': { position: '66% 50%' },
  'exfoliante-cafe-v11.webp': { position: '50% 55%' },
};

export function artDirectionFor(src: string | null | undefined): ArtDirection {
  if (!src) return DEFAULT;
  const name = src.split('?')[0].split('/').pop() ?? '';
  return { ...DEFAULT, ...MAP[name] };
}

export function artStyle(src: string | null | undefined): Record<string, string | number> {
  const art = artDirectionFor(src);
  return {
    '--ad-fit': art.fit ?? 'cover',
    '--ad-pos': art.position ?? '50% 50%',
    '--ad-scale': art.scale ?? 1,
    '--ad-origin': art.origin ?? 'center',
  };
}

/**
 * Static photos that were re-framed after the catalog rows were created. Rows stored in D1 keep
 * pointing at the old file name, so the storefront swaps them here instead of touching the data.
 */
const IMAGE_UPGRADES: Record<string, string> = {
  '/products/aceite-corporal-01.webp': '/products/aceite-canela-clavos-v2.webp',
};

export function upgradeImage<T extends string | null | undefined>(src: T): T {
  if (!src) return src;
  return (IMAGE_UPGRADES[src as string] ?? src) as T;
}
