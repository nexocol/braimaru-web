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

      gsap.from('.hero-visual-mask', {
        scale: 0.96,
        clipPath: 'inset(12% 10% 10% 10% round 48% 48% 42% 44%)',
        opacity: 1,
        duration: 1.25,
        ease: 'power3.out',
      });

      gsap.from('.hero-orbit', {
        scale: 0.92,
        opacity: 0,
        duration: 1.2,
        stagger: 0.14,
        ease: 'power2.out',
      });

      gsap.to('.hero-visual-mask', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.55,
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

      <div className="hero-visual-wrap" aria-hidden="true">
        <div className="hero-aura" />
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-visual-mask">
          <img
            className="hero-visual-main"
            src="/products/shampoo-capilar-v11.webp"
            alt=""
            width="520"
            height="650"
            fetchPriority="high"
          />
        </div>
        <span className="hero-product-note">Shampoo capilar</span>
      </div>

      <div className="hero-copy" data-hero-reveal>
        <p>Bienestar real en rituales inspirados en el cuidado consciente.</p>
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
