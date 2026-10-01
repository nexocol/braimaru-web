import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  phone?: string | null;
}

export function Hero({ phone = null }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [heroImage, setHeroImage] = useState('/editorial/cafe-naranja-campaign.webp');

  useEffect(() => {
    if (!root.current || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        yPercent: 105,
        duration: 0.95,
        stagger: 0.09,
        ease: 'power4.out',
      });

      gsap.from('[data-hero-fade]', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.18,
        ease: 'power3.out',
      });

      gsap.from('.hero-media-shell', {
        clipPath: 'inset(7% 6% 8% 6% round 44% 44% 1.8rem 1.8rem)',
        scale: 0.985,
        opacity: 0,
        duration: 1.15,
        ease: 'power3.out',
      });

      gsap.from('.hero-brand-seal', {
        scale: 0.85,
        opacity: 0,
        rotate: -4,
        duration: 0.9,
        delay: 0.42,
        ease: 'back.out(1.3)',
      });

      gsap.to('.hero-media-main', {
        yPercent: 3.5,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const target = media.current;
    if (!target || reducedMotion) return;

    const onMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      target.style.setProperty('--hero-x', String(x));
      target.style.setProperty('--hero-y', String(y));
    };

    const onLeave = () => {
      target.style.setProperty('--hero-x', '0');
      target.style.setProperty('--hero-y', '0');
    };

    target.addEventListener('pointermove', onMove, { passive: true });
    target.addEventListener('pointerleave', onLeave);

    return () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  return (
    <section id="inicio" className="hero" ref={root}>
      <div className="hero-copy">
        <p className="eyebrow" data-hero-fade>Cosmética natural · Colombia</p>

        <h1 className="hero-title" aria-label="Belleza natural, bienestar real">
          <span className="hero-line"><span data-hero-line>Belleza natural,</span></span>
          <span className="hero-line hero-line--accent"><span data-hero-line>bienestar real.</span></span>
        </h1>

        <p className="hero-lede" data-hero-fade>
          Fórmulas para cuerpo, cabello y labios que convierten el cuidado diario en un momento que sí provoca repetir.
        </p>

        <div className="hero-actions" data-hero-fade>
          <a className="button primary magnetic-button" href="#catalogo">Descubrir productos <ArrowIcon /></a>
          <a className="button ghost magnetic-button" href={buildWhatsAppUrl({ phone })} target="_blank" rel="noreferrer">
            Hablar por WhatsApp
          </a>
        </div>

        <div className="hero-meta" data-hero-fade>
          <span>Cuerpo</span>
          <span>Cabello</span>
          <span>Labios</span>
        </div>
      </div>

      <div className="hero-media" ref={media}>
        <div className="hero-media-orbit" aria-hidden="true" />
        <div className="hero-media-shell">
          <img
            className="hero-media-main"
            src={heroImage}
            alt="Ritual corporal BRAIMARÚ con aceite Café y Naranja"
            width="1100"
            height="1400"
            fetchPriority="high"
            onError={() => setHeroImage('/products/catalog/aceite-naranja-calendula.webp')}
          />
          <div className="hero-media-overlay" aria-hidden="true" />
          <div className="hero-media-caption">
            <span>01 / Ritual corporal</span>
            <strong>Café · Naranja</strong>
          </div>
        </div>

        <div className="hero-brand-seal" aria-hidden="true">
          <img src="/brand/braimaru-logo-premium.png" alt="" />
        </div>

        <figure className="hero-product-orbit">
          <img src="/products/catalog/balsamo-labial.webp" alt="" aria-hidden="true" />
        </figure>
      </div>
    </section>
  );
}
