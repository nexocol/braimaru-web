import { useEffect, useRef } from 'react';
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
  const reducedMotion = useReducedMotion();

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
        clipPath: 'inset(8% 7% 8% 7% round 2rem)',
        scale: 0.985,
        opacity: 0,
        duration: 1.15,
        ease: 'power3.out',
      });

      gsap.to('.hero-media img', {
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

  return (
    <section id="inicio" className="hero" ref={root}>
      <div className="hero-copy">
        <p className="eyebrow" data-hero-fade>Cosmética natural · Colombia</p>

        <h1 className="hero-title" aria-label="Belleza natural, bienestar real">
          <span className="hero-line"><span data-hero-line>Belleza natural,</span></span>
          <span className="hero-line hero-line--accent"><span data-hero-line>bienestar real.</span></span>
        </h1>

        <p className="hero-lede" data-hero-fade>
          Ritual, textura y cuidado consciente reunidos en una experiencia creada para sentirse tan bien como se ve.
        </p>

        <div className="hero-actions" data-hero-fade>
          <a className="button primary" href="#catalogo">Descubrir productos <ArrowIcon /></a>
          <a className="button ghost" href={buildWhatsAppUrl({ phone })} target="_blank" rel="noreferrer">
            Hablar por WhatsApp
          </a>
        </div>

        <div className="hero-meta" data-hero-fade>
          <span>Cuerpo</span>
          <span>Cabello</span>
          <span>Labios</span>
        </div>
      </div>

      <div className="hero-media">
        <div className="hero-media-shell">
          <img
            src="/editorial/cafe-naranja-campaign.webp"
            alt="Ritual corporal BRAIMARÚ con aceite Café y Naranja"
            width="1100"
            height="1400"
            fetchPriority="high"
          />
          <div className="hero-media-overlay" aria-hidden="true" />
          <div className="hero-media-caption">
            <span>01 / Ritual corporal</span>
            <strong>Café · Naranja</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
