import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import { ArrowIcon } from '../../components/ArrowIcon/ArrowIcon';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!root.current || reducedMotion) return;

    const context = gsap.context(() => {
      gsap.from('[data-hero-reveal]', {
        y: 36,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      gsap.from('.hero-visual-main', {
        scale: 1.06,
        opacity: 0,
        duration: 1.25,
        ease: 'power3.out',
      });

      gsap.to('.hero-visual-main', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
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
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <img className="hero-visual-main" src="/products/aceite-corporal-01.webp" alt="" width="780" height="900" fetchPriority="high" />
        <img className="hero-logo-stamp" src="/brand/braimaru-logo.webp" alt="" width="420" height="300" />
      </div>

      <div className="hero-copy" data-hero-reveal>
        <p>Bienestar real en rituales inspirados en el cuidado consciente.</p>
        <div className="hero-actions">
          <a className="button primary" href="#productos">Descubrir productos <ArrowIcon /></a>
          <a className="button ghost" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">Hablar por WhatsApp</a>
        </div>
      </div>

      <div className="hero-footnote" data-hero-reveal>01 — Belleza natural, bienestar real</div>
    </section>
  );
}
