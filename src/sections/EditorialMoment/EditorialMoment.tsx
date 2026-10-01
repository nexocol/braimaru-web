import { motion } from 'motion/react';

export function EditorialMoment() {
  return (
    <section id="historia" className="editorial-section">
      <div className="editorial-visuals">
        <motion.div
          className="editorial-image"
          initial={{ clipPath: 'inset(8% 0 8% 0)', opacity: 0.8 }}
          whileInView={{ clipPath: 'inset(0% 0 0% 0)', opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85 }}
        >
          <img
            src="/editorial/hair-line-v11.webp"
            alt="Línea capilar BRAIMARÚ con shampoo, acondicionador y termoprotector"
            loading="lazy"
            width="600"
            height="711"
          />
        </motion.div>

        <motion.figure
          className="editorial-detail"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <img
            src="/products/catalog/balsamo-labial.webp"
            alt="Bálsamo labial BRAIMARÚ"
            loading="lazy"
            width="700"
            height="900"
          />
          <figcaption>Cuidado que se siente cercano, desde el primer gesto.</figcaption>
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
          Del cuerpo al cabello, BRAIMARÚ convierte el cuidado cotidiano en una experiencia cálida,
          sensorial y propia.
        </p>
        <span className="editorial-index">Cuerpo · cabello · labios / BRAIMARÚ</span>
      </motion.div>
    </section>
  );
}
