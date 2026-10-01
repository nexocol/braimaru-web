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
      gsap.from('[data-hero-reveal]', {
        y: 34,
        opacity: 0,
        duration: 1,
        stagger: 0.11,
        ease: 'power3.out',
      });

      gsap.from('[data-hero-card]', {
        y: 44,
        scale: 0.97,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.hero-logo-stamp', {
        y: 22,
        opacity: 0,
        duration: 1,
        delay: 0.45,
        ease: 'power2.out',
      });

      gsap.to('.hero-campaign-main', {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.55,
        },
      });

      gsap.to('.hero-campaign-side', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7,
        },
      });

      gsap.to('.hero-campaign-detail', {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.75,
        },
      });
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section id="inicio" className="hero" ref={root}>
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="hero-kicker" data-hero-reveal>Cosmética natural · Colombia</div>

      <h1 className="hero-title" data-hero-reveal>
        <span>Belleza</span>
        <span>natural.</span>
      </h1>

      <div className="hero-campaign" aria-hidden="true">
        <div className="hero-campaign-backdrop" />

        <figure className="hero-campaign-main" data-hero-card>
          <img
            src="/products/catalog/crema-manos-corporal.webp"
            alt=""
            width="900"
            height="1180"
            fetchPriority="high"
          />
        </figure>

        <figure className="hero-campaign-side" data-hero-card>
          <img
            src="/products/catalog/aceite-naranja-calendula.webp"
            alt=""
            width="900"
            height="1180"
            fetchPriority="high"
          />
        </figure>

        <figure className="hero-campaign-detail" data-hero-card>
          <img
            src="/products/catalog/balsamo-labial.webp"
            alt=""
            width="720"
            height="960"
          />
        </figure>

        <img
          className="hero-logo-stamp"
          src="/brand/braimaru-logo.webp"
          alt=""
          width="420"
          height="300"
        />

        <span className="hero-campaign-caption">Cuerpo · cabello · bienestar</span>
      </div>

      <div className="hero-copy" data-hero-reveal>
        <p>Cuidado consciente, texturas cálidas y rituales pensados para habitar tu bienestar.</p>
        <div className="hero-actions">
          <a className="button primary" href="#productos">Descubrir productos <ArrowIcon /></a>
          <a className="button ghost" href={buildWhatsAppUrl({ phone })} target="_blank" rel="noreferrer">
            Hablar por WhatsApp
          </a>
        </div>
      </div>

      <div className="hero-footnote" data-hero-reveal>
        01 — Belleza natural, bienestar real
      </div>
    </section>
  );
}
