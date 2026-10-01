import { useRef, type CSSProperties } from 'react';
import { usePointerDepth, useScrollScenes } from '../../lib/motion';

const depth = (value: number, tilt = 0) => ({ '--depth': value, '--tilt': tilt }) as CSSProperties;

const principles = [
  { title: 'Naturaleza', copy: 'Inspiración en ingredientes y aromas que reconoces.' },
  { title: 'Cuidado consciente', copy: 'Rituales simples que caben en tu día.' },
  { title: 'Bienestar', copy: 'Sentirte bien con lo que te pones y con cómo te cuidas.' },
];

export function BrandStory() {
  const root = useRef<HTMLElement>(null);
  useScrollScenes(root);
  usePointerDepth(root);

  return (
    <section id="historia" className="brand-story section-shell" ref={root}>
      <div className="story-grid">
        <div className="story-copy">
          <p className="eyebrow" data-fade>Nuestra historia</p>
          <h2 data-lines>Una marca que entiende el cuidado como <em>bienestar.</em></h2>
          <p className="story-lede" data-fade data-delay="0.1">
            BRAIMARÚ nace de la unión entre naturaleza y cuidado consciente. Cada producto busca acompañar una pausa sencilla dentro de tu día.
          </p>
        </div>

        <div className="story-collage">
          <figure className="story-main depth" style={depth(10)} data-mask data-parallax="4">
            <img
              src="/products/catalog/jabon-avena-aclarante.webp"
              alt="Jabón de avena sobre piedra con almendras"
              width="573"
              height="700"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <figure className="story-detail depth" style={depth(-20, 2)} data-mask>
            <img
              src="/products/catalog/jabon-coco.webp"
              alt="Jabones de coco BRAIMARÚ"
              width="573"
              height="700"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className="story-seal depth" style={depth(24)} data-fade data-delay="0.2">
            <img src="/brand/braimaru-logo-premium.png" alt="BRAIMARÚ" width="720" height="569" loading="lazy" />
          </div>
        </div>
      </div>

      <ol className="story-principles" data-stagger>
        {principles.map((principle, index) => (
          <li key={principle.title}>
            <span>0{index + 1}</span>
            <h3>{principle.title}</h3>
            <p>{principle.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
