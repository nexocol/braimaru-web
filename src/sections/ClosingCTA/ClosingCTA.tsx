import { useRef } from 'react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { useMagnetic, useScrollScenes } from '../../lib/motion';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

interface ClosingCTAProps {
  phone?: string | null;
}

const steps = [
  { title: 'Elige', copy: 'Abre los productos que te llamen la atención.' },
  { title: 'Escríbenos', copy: 'Cuéntanos qué buscas por WhatsApp.' },
  { title: 'Coordina', copy: 'Confirmamos precio, disponibilidad y tu pedido.' },
];

export function ClosingCTA({ phone = null }: ClosingCTAProps) {
  const root = useRef<HTMLElement>(null);
  useScrollScenes(root);
  useMagnetic(root);

  return (
    <section className="closing" ref={root}>
      <div className="closing-card">
        <div className="closing-copy">
          <p className="eyebrow" data-fade>¿Hablamos?</p>
          <h2 data-lines>Encuentra el ritual que mejor se siente contigo.</h2>
          <a
            className="button light"
            href={buildWhatsAppUrl({ phone })}
            target="_blank"
            rel="noreferrer"
            data-magnetic
          >
            Hablar por WhatsApp <ArrowIcon />
          </a>
        </div>

        <ol className="closing-steps" data-stagger>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
