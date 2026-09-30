import type { SiteSettings } from '../../lib/api/types';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

interface FooterProps {
  site: SiteSettings;
}

export function Footer({ site }: FooterProps) {
  const hasContact = Boolean(
    site.whatsapp_phone || site.instagram_url || site.brand_email,
  );

  return (
    <footer className="footer">
      <div className="footer-identity">
        <div className="footer-brand">BRAIMARÚ</div>
        <p>Cosmética natural · Colombia</p>
      </div>

      <nav className="footer-nav" aria-label="Navegación del pie de página">
        <a href="#productos">Productos</a>
        <a href="#ritual">Tu ritual</a>
        <a href="#historia">Nuestra esencia</a>
      </nav>

      <div
        className="footer-contact"
        aria-label={hasContact ? 'Canales de contacto' : undefined}
        aria-hidden={hasContact ? undefined : true}
      >
        {site.whatsapp_phone ? (
          <a
            href={buildWhatsAppUrl({ phone: site.whatsapp_phone })}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        ) : null}
        {site.instagram_url ? (
          <a href={site.instagram_url} target="_blank" rel="noreferrer">
            Instagram
          </a>
        ) : null}
        {site.brand_email ? <a href={`mailto:${site.brand_email}`}>Correo</a> : null}
      </div>

      <p className="footer-copyright">© 2026 BRAIMARÚ</p>
    </footer>
  );
}
