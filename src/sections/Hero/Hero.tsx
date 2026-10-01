import { useRef, type CSSProperties } from 'react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { useQuickView } from '../../components/ProductQuickView/quickViewContext';
import { requestCatalogFilter } from '../../lib/catalogBus';
import { useMagnetic, usePointerDepth, useScrollScenes } from '../../lib/motion';
import { buildWhatsAppUrl } from '../../lib/whatsapp';
import type { Product } from '../../types/catalog';

interface HeroProps {
  phone?: string | null;
  products: Product[];
}

const quickLinks = [
  { label: 'Cuerpo', filter: 'aceites-corporales' as const },
  { label: 'Cabello', filter: 'cuidado-capilar' as const },
  { label: 'Jabones', filter: 'jabones' as const },
  { label: 'Labios', filter: 'cuidado-labial' as const },
];

const depth = (value: number, tilt = 0) => ({ '--depth': value, '--tilt': tilt }) as CSSProperties;

export function Hero({ phone = null, products }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { open } = useQuickView();
  const featuredChip = products.find((product) => product.id === 'balsamo-labial' && product.active);

  useScrollScenes(root);
  usePointerDepth(root);
  useMagnetic(root);

  return (
    <section id="inicio" className="hero" ref={root}>
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-copy">
        <p className="eyebrow" data-fade>Cosmética natural · Colombia</p>

        <h1 className="hero-title" data-lines aria-label="Belleza natural, bienestar real.">
          <span className="line-block">Belleza natural,</span>
          <span className="line-block"><em>bienestar real.</em></span>
        </h1>

        <p className="hero-lede" data-fade data-delay="0.12">
          Aceites, jabones, cuidado capilar y labial para convertir tu rutina diaria en un momento de bienestar.
        </p>

        <div className="hero-actions" data-fade data-delay="0.2">
          <a className="button primary" href="#catalogo" data-magnetic>
            Ver catálogo <ArrowIcon />
          </a>
          <a
            className="button ghost"
            href={buildWhatsAppUrl({ phone })}
            target="_blank"
            rel="noreferrer"
            data-magnetic
          >
            Escribir por WhatsApp
          </a>
        </div>

        <ul className="hero-quick" aria-label="Explorar por línea" data-fade data-delay="0.28">
          {quickLinks.map((link) => (
            <li key={link.label}>
              <a
                href="#catalogo"
                onClick={() => requestCatalogFilter(link.filter)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-stage" ref={stage}>
        <div className="hero-orbit depth" style={depth(-10, 2)} aria-hidden="true" />

        <figure className="hero-arch depth" style={depth(12)} data-mask data-parallax="3">
          <img
            src="/editorial/family-v11.webp"
            alt="Aceites, jabones y cuidado corporal BRAIMARÚ entre orquídeas"
            width="850"
            height="638"
            fetchPriority="high"
          />
          <figcaption>
            <span>01</span>
            Universo BRAIMARÚ
          </figcaption>
        </figure>

        {featuredChip ? (
          <button
            type="button"
            className="hero-chip depth"
            style={depth(-26, -2)}
            onClick={() => open(featuredChip)}
            aria-label={`Ver ${featuredChip.name}`}
          >
            <span className="hero-chip-media">
              <img src="/products/catalog/balsamo-labial.webp" alt="" width="720" height="900" loading="lazy" />
            </span>
            <span className="hero-chip-copy">
              <small>Favorito</small>
              {featuredChip.name}
              <ArrowIcon />
            </span>
          </button>
        ) : null}

        <p className="hero-note depth" style={depth(22)} aria-hidden="true">
          Hecho con intención.<br />Pensado para repetir.
        </p>
      </div>
    </section>
  );
}
