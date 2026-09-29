import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

interface ClosingCTAProps {
  phone?: string | null;
}

export function ClosingCTA({ phone = null }: ClosingCTAProps) {
  return (
    <section className="closing">
      <p className="eyebrow">BRAIMARÚ</p>
      <h2>Belleza natural,<br /><em>bienestar real.</em></h2>
      <a
        className="button primary light"
        href={buildWhatsAppUrl({ phone })}
        target="_blank"
        rel="noreferrer"
      >
        Hablar con la marca <ArrowIcon />
      </a>
    </section>
  );
}
