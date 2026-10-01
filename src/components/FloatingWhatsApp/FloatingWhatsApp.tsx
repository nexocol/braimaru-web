import { useEffect, useState } from 'react';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

interface FloatingWhatsAppProps {
  phone?: string | null;
}

const LABELS = ['Escríbenos', 'Haz tu pedido'];
const FIRST_DELAY_MS = 7000;
const PEEK_MS = 4800;
const REST_MS = 26000;
const MAX_PEEKS = 4;

export function FloatingWhatsApp({ phone = null }: FloatingWhatsAppProps) {
  const [peek, setPeek] = useState(false);
  const [labelIndex, setLabelIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);

  // Periodic, quiet attention cue. Skipped entirely for reduced motion, stops once
  // the visitor interacts, and only runs while the tab is visible.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches || engaged) return undefined;

    let timer = 0;
    let count = 0;
    let stopped = false;

    const schedule = (delay: number, fn: () => void) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(fn, delay);
    };

    const run = () => {
      if (stopped) return;
      if (document.hidden) {
        schedule(4000, run);
        return;
      }
      setLabelIndex(count % LABELS.length);
      setPeek(true);
      count += 1;
      schedule(PEEK_MS, () => {
        setPeek(false);
        if (count < MAX_PEEKS) schedule(REST_MS, run);
      });
    };

    schedule(FIRST_DELAY_MS, run);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      setPeek(false);
    };
  }, [engaged]);

  const label = LABELS[labelIndex];

  return (
    <div className={`floating-whatsapp-wrap${peek ? ' is-peek' : ''}`}>
      <span className="floating-whatsapp-bubble" aria-hidden="true">
        {label}
      </span>
      <a
        className="floating-whatsapp"
        href={buildWhatsAppUrl({ phone })}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir WhatsApp con BRAIMARÚ"
        title="Escribir por WhatsApp"
        onPointerDown={() => setEngaged(true)}
        onFocus={() => setPeek(false)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.21-.242-.579-.487-.5-.669-.51-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.894 9.825 9.825 0 0 1 2.893 6.991c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
        <span className="floating-whatsapp-label" aria-hidden="true">
          {label}
        </span>
      </a>
    </div>
  );
}
