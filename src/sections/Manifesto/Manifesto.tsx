import { useRef } from 'react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { useScrollScenes } from '../../lib/motion';

function Pill({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span className={`pill ${className}`} aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useScrollScenes(root);

  return (
    <section className="manifesto section-shell" ref={root}>
      <p className="eyebrow" data-fade>Nuestra esencia</p>

      <h2 className="manifesto-title" data-lines aria-label="Cuidarte no debería sentirse como una tarea. Debería sentirse bien.">
        Cuidarte no debería sentirse <Pill src="/editorial/exfoliante-cafe-v11.webp" className="pill--soap" /> como
        una tarea. <em>Debería sentirse</em> <Pill src="/products/catalog/balsamo-labial.webp" className="pill--tube" /> <em>bien.</em>
      </h2>

      <div className="manifesto-foot" data-stagger>
        <p>
          BRAIMARÚ reúne textura, aroma y bienestar para acompañar el cuerpo, el cabello y los labios con una rutina cercana, sensorial y fácil de disfrutar.
        </p>
        <a className="text-link" href="#colecciones">
          Explorar colecciones <ArrowIcon />
        </a>
      </div>
    </section>
  );
}
