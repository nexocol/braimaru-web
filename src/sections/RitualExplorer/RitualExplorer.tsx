import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { useQuickView } from '../../components/ProductQuickView/quickViewContext';
import { artStyle } from '../../data/artDirection';
import { useMagnetic, usePointerDepth, useScrollScenes } from '../../lib/motion';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product, RitualTag } from '../../types/catalog';

interface RitualDefinition {
  id: RitualTag;
  label: string;
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
  /** `contain` keeps the whole packshot visible over a blurred copy of itself */
  fit: 'cover' | 'contain';
  /** curated picks, in order; the first ones found in the catalog are shown */
  picks: string[];
}

// The "picks" are curated here on purpose: the ritual tags that come with each
// product are for filtering, not for storytelling, and produced mismatches
// between the photo and the listed products.
const rituals: RitualDefinition[] = [
  {
    id: 'hidratar',
    label: 'Hidratar',
    eyebrow: 'Suavidad + confort',
    title: 'Una pausa para tu piel',
    copy: 'Texturas cremosas para sumar confort a tu día, en casa o en el bolso.',
    image: '/products/catalog/crema-manos-corporal.webp',
    fit: 'contain',
    imageAlt: 'Crema de manos y corporal BRAIMARÚ',
    picks: ['crema-manos-corporal', 'balsamo-labial', 'jabon-manzana-verde'],
  },
  {
    id: 'nutrir',
    label: 'Nutrir',
    eyebrow: 'Aceites + masaje',
    title: 'Aceites para consentirte',
    copy: 'Aceites corporales con aromas que convierten el masaje en un momento para ti.',
    image: '/products/catalog/aceite-cafe-naranja.webp',
    fit: 'cover',
    imageAlt: 'Aceites corporales Café y Naranja BRAIMARÚ',
    picks: ['aceite-corporal-cafe-naranja', 'aceite-corporal-calendula-naranja', 'aceite-corporal-canela'],
  },
  {
    id: 'exfoliar',
    label: 'Exfoliar',
    eyebrow: 'Renovar + suavizar',
    title: 'Textura para la ducha',
    copy: 'Jabones con textura para sumar una pausa sensorial a tu rutina de limpieza.',
    image: '/editorial/exfoliante-cafe-v11.webp',
    fit: 'cover',
    imageAlt: 'Jabones exfoliantes de café BRAIMARÚ',
    picks: ['jabon-exfoliante-cafe', 'jabon-avena-aclarante', 'jabon-maracuya'],
  },
  {
    id: 'cuidado-corporal',
    label: 'Cuerpo',
    eyebrow: 'Masaje + bienestar',
    title: 'Tu ritual corporal',
    copy: 'Aceites y texturas para transformar la rutina en un momento dedicado a ti.',
    image: '/products/catalog/aceite-naranja-calendula.webp',
    fit: 'contain',
    imageAlt: 'Aceite corporal Caléndula y Naranja BRAIMARÚ aplicado sobre la piel',
    picks: ['aceite-corporal-calendula-naranja', 'aceite-corporal-canela', 'jabon-canela-clavos'],
  },
  {
    id: 'cuidado-capilar',
    label: 'Cabello',
    eyebrow: 'Rutina completa',
    title: 'Un ritual para tu cabello',
    copy: 'Shampoo, acondicionador y termoprotector reunidos en una misma línea de cuidado.',
    image: '/editorial/hair-line-v11.webp',
    fit: 'contain',
    imageAlt: 'Línea capilar BRAIMARÚ: shampoo, acondicionador y termoprotector',
    picks: ['shampoo-capilar', 'acondicionador-capilar', 'termoprotector-capilar'],
  },
];

interface RitualExplorerProps {
  products: Product[];
  phone?: string | null;
}

export function RitualExplorer({ products, phone = null }: RitualExplorerProps) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<RitualTag>('cuidado-corporal');
  const { open } = useQuickView();

  useScrollScenes(root);
  usePointerDepth(root);
  useMagnetic(root);

  const matched = useMemo(() => {
    const byKey = new Map<string, Product>();
    products.filter((product) => product.active).forEach((product) => {
      byKey.set(product.id, product);
      byKey.set(product.slug, product);
    });
    return Object.fromEntries(
      rituals.map((ritual) => {
        const curated = ritual.picks.map((pick) => byKey.get(pick)).filter((product): product is Product => Boolean(product));
        const fallback = products.filter((product) => product.active && product.ritualTags.includes(ritual.id));
        return [ritual.id, (curated.length > 0 ? curated : fallback).slice(0, 3)];
      }),
    ) as Record<RitualTag, Product[]>;
  }, [products]);

  const move = (direction: 1 | -1) => {
    const index = rituals.findIndex((ritual) => ritual.id === active);
    const next = rituals[(index + direction + rituals.length) % rituals.length];
    setActive(next.id);
    root.current?.querySelector<HTMLButtonElement>(`[data-ritual="${next.id}"]`)?.focus();
  };

  return (
    <section id="ritual" className="ritual section-shell" ref={root}>
      <div className="section-head">
        <div>
          <p className="eyebrow" data-fade>Encuentra tu ritual</p>
          <h2 data-lines aria-label="Elige lo que quieres sentir hoy.">Elige lo que<br />quieres <em>sentir hoy.</em></h2>
        </div>
        <p data-fade data-delay="0.1">Cinco entradas al universo BRAIMARÚ. Escoge una y ve qué productos la componen.</p>
      </div>

      <div className="ritual-board" data-fade data-delay="0.1">
        <div className="ritual-tabs" role="tablist" aria-label="Tipo de ritual">
          {rituals.map((ritual, index) => (
            <button
              key={ritual.id}
              type="button"
              role="tab"
              id={`ritual-tab-${ritual.id}`}
              data-ritual={ritual.id}
              aria-selected={active === ritual.id}
              aria-controls={`ritual-panel-${ritual.id}`}
              tabIndex={active === ritual.id ? 0 : -1}
              onClick={() => setActive(ritual.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                  event.preventDefault();
                  move(1);
                }
                if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  move(-1);
                }
              }}
            >
              <span>0{index + 1}</span>
              {ritual.label}
            </button>
          ))}
        </div>

        <div className="ritual-stage">
          <div className="ritual-visuals">
            {rituals.map((ritual) => (
              <figure
                key={ritual.id}
                className={`ritual-visual media-stage${active === ritual.id ? ' is-active' : ''}`}
                style={{ ...artStyle(ritual.image), '--ad-fit': ritual.fit, '--stage-img': `url("${ritual.image}")` } as CSSProperties}
              >
                <img src={ritual.image} alt={active === ritual.id ? ritual.imageAlt : ''} loading="lazy" decoding="async" />
              </figure>
            ))}
            <span className="ritual-count depth" style={{ '--depth': -14 } as CSSProperties} aria-hidden="true">
              {String(rituals.findIndex((ritual) => ritual.id === active) + 1).padStart(2, '0')}
              <small>/ 05</small>
            </span>
          </div>

          <div className="ritual-contents">
            {rituals.map((ritual) => (
              <div
                key={ritual.id}
                role="tabpanel"
                id={`ritual-panel-${ritual.id}`}
                aria-labelledby={`ritual-tab-${ritual.id}`}
                className={`ritual-content${active === ritual.id ? ' is-active' : ''}`}
                aria-hidden={active !== ritual.id}
                inert={active !== ritual.id}
              >
                <p className="eyebrow">{ritual.eyebrow}</p>
                <h3>{ritual.title}</h3>
                <p className="ritual-copy">{ritual.copy}</p>

                <ul className="ritual-picks" aria-label={`Productos del ritual ${ritual.label}`}>
                  {matched[ritual.id].map((product) => (
                    <li key={product.id}>
                      <button type="button" onClick={() => open(product)}>
                        <span>{product.name}</span>
                        <ArrowIcon />
                      </button>
                    </li>
                  ))}
                </ul>

                <a
                  className="button primary"
                  href={buildWhatsAppUrl({
                    phone,
                    message: `Hola, quiero armar mi ritual de ${ritual.label.toLowerCase()} con BRAIMARÚ. ¿Me recomiendan qué productos elegir?`,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  data-magnetic
                >
                  Pedir recomendación <ArrowIcon />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
