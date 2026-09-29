import { useState } from 'react';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#inicio" aria-label="BRAIMARÚ, ir al inicio">BRAIMARÚ</a>
      <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-nav">
        {open ? 'Cerrar' : 'Menú'}
      </button>
      <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Navegación principal">
        <a href="#productos" onClick={close}>Productos</a>
        <a href="#ritual" onClick={close}>Tu ritual</a>
        <a href="#historia" onClick={close}>Nuestra esencia</a>
        <a className="nav-cta" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">WhatsApp</a>
      </nav>
    </header>
  );
}
