import { useState } from 'react';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

interface HeaderProps {
  phone?: string | null;
}

export function Header({ phone = null }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#inicio" aria-label="BRAIMARÚ, ir al inicio">
        <img src="/brand/braimaru-logo.webp" alt="BRAIMARÚ" width="156" height="82" />
      </a>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="primary-nav"
      >
        {open ? 'Cerrar' : 'Menú'}
      </button>

      <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Navegación principal">
        <a href="#colecciones" onClick={close}>Colecciones</a>
        <a href="#ritual" onClick={close}>Tu ritual</a>
        <a href="#historia" onClick={close}>Historia</a>
        <a href="#catalogo" onClick={close}>Catálogo</a>
        <a className="nav-cta" href={buildWhatsAppUrl({ phone })} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </nav>
    </header>
  );
}
