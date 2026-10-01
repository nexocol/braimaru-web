import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

interface ClosingCTAProps {
  phone?: string | null;
}

export function ClosingCTA({ phone = null }: ClosingCTAProps) {
  return (
    <section className="closing">
      <div>
        <p className="eyebrow">¿Hablamos?</p>
        <h2>Encuentra el ritual que mejor se siente contigo.</h2>
      </div>
      <a
        className="button light"
        href={buildWhatsAppUrl({ phone })}
        target="_blank"
        rel="noreferrer"
      >
        Hablar por WhatsApp <ArrowIcon />
      </a>
    </section>
  );
}
