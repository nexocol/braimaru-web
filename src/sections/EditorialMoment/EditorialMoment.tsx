import { motion } from 'motion/react';

export function EditorialMoment() {
  return (
    <section id="historia" className="editorial-section">
      <div className="editorial-visuals">
        <div className="editorial-image">
          <img
            src="/editorial/hair-line-v11.webp"
            alt="Línea capilar BRAIMARÚ con shampoo, acondicionador y termoprotector"
            loading="eager"
            width="600"
            height="711"
          />
        </div>

        <figure className="editorial-detail">
          <img
            src="/editorial/exfoliante-cafe-v11.webp"
            alt="Detalle de la línea exfoliante de café BRAIMARÚ"
            loading="lazy"
            width="700"
            height="629"
          />
          <figcaption>Texturas para convertir la rutina en una pausa.</figcaption>
        </figure>
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
