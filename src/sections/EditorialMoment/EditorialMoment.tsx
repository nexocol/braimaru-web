import { useRef, type CSSProperties } from 'react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { requestCatalogFilter } from '../../lib/catalogBus';
import { useMagnetic, usePointerDepth, useScrollScenes } from '../../lib/motion';

const depth = (value: number, tilt = 0) => ({ '--depth': value, '--tilt': tilt }) as CSSProperties;

// Ingredients named on the product label shown in the photo (Aceite corporal Caléndula y Naranja).
const labelNotes = ['Caléndula', 'Naranja', 'Vitamina E', 'Ácido hialurónico'];

export function EditorialMoment() {
  const root = useRef<HTMLElement>(null);
  useScrollScenes(root);
  usePointerDepth(root);
  useMagnetic(root);

  return (
    <section id="editorial" className="campaign" ref={root}>
      <div className="campaign-inner">
        <div className="campaign-copy">
          <p className="eyebrow" data-fade>Cuidado consciente</p>
          <h2 data-lines>Tu rutina puede sentirse <em>mucho mejor.</em></h2>
          <p className="campaign-lede" data-fade data-delay="0.1">
            Una textura agradable, un aroma cálido y unos minutos para ti. El cuidado no tiene que ser complicado para sentirse especial.
          </p>
          <ul className="campaign-notes" aria-label="En la etiqueta del Aceite corporal Caléndula y Naranja" data-stagger>
            {labelNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
          <a
            className="button light"
            href="#catalogo"
            onClick={() => requestCatalogFilter('aceites-corporales')}
            data-magnetic
            data-fade
            data-delay="0.2"
          >
            Ver aceites corporales <ArrowIcon />
          </a>
        </div>

        <div className="campaign-stage">
          <svg className="campaign-badge depth" style={depth(-16, 4)} viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <text>
              <textPath href="#badge-circle" startOffset="0">
                BELLEZA NATURAL · BIENESTAR REAL · BELLEZA NATURAL · BIENESTAR REAL ·
              </textPath>
            </text>
          </svg>

          <figure className="campaign-photo depth" style={depth(14, -1.5)} data-mask data-parallax="4">
            <img
              src="/products/catalog/aceite-naranja-calendula.webp"
              alt="Aceite corporal Caléndula y Naranja BRAIMARÚ aplicado sobre la piel"
              width="720"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <p className="campaign-tag depth" style={depth(28)} aria-hidden="true">
            <span>Ritual corporal</span>
            Caléndula + Naranja
          </p>
        </div>
      </div>
    </section>
  );
}
