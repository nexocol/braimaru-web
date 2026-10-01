import { useEffect, useState } from 'react';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

interface HeaderProps {
  phone?: string | null;
}

const links = [
  { href: '#colecciones', label: 'Colecciones' },
  { href: '#ritual', label: 'Tu ritual' },
  { href: '#historia', label: 'Historia' },
  { href: '#catalogo', label: 'Catálogo' },
];

export function Header({ phone = null }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 32);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <a className="brand-lockup" href="#inicio" onClick={close} aria-label="BRAIMARÚ, ir al inicio">
        <img src="/brand/braimaru-logo-premium.png" alt="BRAIMARÚ" width="720" height="569" fetchPriority="high" />
      </a>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="primary-nav"
      >
        <span className="menu-toggle-label">{open ? 'Cerrar' : 'Menú'}</span>
        <span className="menu-toggle-bars" aria-hidden="true"><span /><span /></span>
      </button>

      <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Navegación principal">
        {links.map((link, index) => (
          <a key={link.href} href={link.href} onClick={close}>
            <span className="nav-index" aria-hidden="true">0{index + 1}</span>
            {link.label}
          </a>
        ))}
        <a className="nav-cta" href={buildWhatsAppUrl({ phone })} target="_blank" rel="noreferrer" onClick={close}>
          WhatsApp
        </a>
      </nav>
    </header>
  );
}
