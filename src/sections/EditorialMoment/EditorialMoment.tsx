import { motion } from 'motion/react';

export function EditorialMoment() {
  return (
    <section id="historia" className="editorial-section">
      <div className="editorial-visuals">
        <motion.div
          className="editorial-image"
          initial={{ clipPath: 'inset(4% 0 4% 0)', opacity: 1 }}
          whileInView={{ clipPath: 'inset(0% 0 0% 0)', opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85 }}
        >
          <img
            src="/editorial/hair-line-v11.webp"
            alt="Línea capilar BRAIMARÚ con shampoo, acondicionador y termoprotector"
            loading="eager"
            width="600"
            height="711"
          />
        </motion.div>

        <motion.figure
          className="editorial-detail"
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <img
            src="/editorial/exfoliante-cafe-v11.webp"
            alt="Detalle de la línea exfoliante de café BRAIMARÚ"
            loading="lazy"
            width="700"
            height="629"
          />
          <figcaption>Texturas para convertir la rutina en una pausa.</figcaption>
        </motion.figure>
      </div>

      <motion.div
        className="editorial-copy"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <p className="eyebrow">Cuidado consciente</p>
        <h2>Natural no tiene que sentirse simple.</h2>
        <p>
          BRAIMARÚ reúne cuidado corporal y capilar en una experiencia cálida, cercana y sensorial.
        </p>
        <span className="editorial-index">BRAIMARÚ / Belleza natural</span>
      </motion.div>
    </section>
  );
}
