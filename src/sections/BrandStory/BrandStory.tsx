import { motion } from 'motion/react';

export function BrandStory() {
  return (
    <section id="historia" className="brand-story section-shell">
      <motion.figure
        className="brand-story-visual"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/editorial/family-v11.webp"
          alt="Universo de productos BRAIMARÚ entre flores y elementos naturales"
          loading="lazy"
          width="1100"
          height="825"
        />
        <figcaption>Una marca nacida entre naturaleza, cuidado y bienestar.</figcaption>
      </motion.figure>

      <motion.div
        className="brand-story-copy"
        initial={{ opacity: 0, x: 28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75 }}
      >
        <p className="eyebrow">Nuestra historia</p>
        <h2>Cuidar la piel también es cuidar de ti.</h2>
        <p>
          BRAIMARÚ nace de la unión entre la naturaleza y el cuidado consciente de la piel.
          Su propuesta convierte cada producto en una invitación a hacer una pausa y volver al
          bienestar cotidiano.
        </p>
        <p>
          Para BRAIMARÚ, el cuidado también acompaña al cuerpo, la autoestima y el bienestar
          emocional.
        </p>
        <div className="brand-story-values" aria-label="Valores BRAIMARÚ">
          <span>Naturaleza</span>
          <span>Cuidado consciente</span>
          <span>Bienestar</span>
        </div>
      </motion.div>
    </section>
  );
}
