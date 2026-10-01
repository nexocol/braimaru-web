import { motion } from 'motion/react';

export function Manifesto() {
  return (
    <section className="manifesto section-shell">
      <div className="manifesto-copy-block">
        <p className="eyebrow">Nuestra esencia</p>
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65 }}
        >
          Tu piel merece un cuidado que <em>se sienta propio.</em>
        </motion.h2>
        <p className="manifesto-copy">
          BRAIMARÚ transforma la rutina en una pausa: fórmulas, aromas y texturas que acompañan el cuerpo y el cabello desde una mirada más consciente.
        </p>
      </div>

      <motion.figure
        className="manifesto-detail"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.08 }}
      >
        <img
          src="/products/catalog/balsamo-labial.webp"
          alt="Bálsamo labial BRAIMARÚ"
          loading="lazy"
          width="560"
          height="760"
        />
        <figcaption>Pequeños gestos. Bienestar cotidiano.</figcaption>
      </motion.figure>
    </section>
  );
}
