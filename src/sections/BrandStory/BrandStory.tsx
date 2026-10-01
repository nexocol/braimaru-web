import { motion } from 'motion/react';

export function BrandStory() {
  return (
    <section id="historia" className="brand-story section-shell">
      <motion.div
        className="brand-story-copy"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
      >
        <p className="eyebrow">Nuestra historia</p>
        <h2>Una marca que entiende el cuidado como <em>bienestar.</em></h2>
        <p>
          BRAIMARÚ nace de la unión entre naturaleza y cuidado consciente. Cada producto busca acompañar una pausa sencilla dentro del día.
        </p>
        <div className="brand-story-values" aria-label="Valores BRAIMARÚ">
          <span>01 Naturaleza</span>
          <span>02 Cuidado consciente</span>
          <span>03 Bienestar</span>
        </div>
      </motion.div>

      <motion.figure
        className="brand-story-visual"
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75 }}
      >
        <img
          src="/editorial/family-v11.webp"
          alt="Universo de productos BRAIMARÚ entre flores y elementos naturales"
          loading="lazy"
          width="1100"
          height="825"
        />
        <figcaption>
          <img src="/brand/braimaru-logo-premium.png" alt="" aria-hidden="true" />
          <span>Belleza natural · bienestar real</span>
        </figcaption>
      </motion.figure>
    </section>
  );
}
