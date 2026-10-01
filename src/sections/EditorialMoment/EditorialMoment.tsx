import { motion } from 'motion/react';

export function EditorialMoment() {
  return (
    <section id="editorial" className="campaign-moment">
      <motion.figure
        className="campaign-moment-media"
        initial={{ opacity: 0, clipPath: 'inset(6% 0 6% 0)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0% 0)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/products/catalog/aceite-naranja-calendula.webp"
          alt="Ritual corporal BRAIMARÚ con aceite de Caléndula y Naranja"
          loading="lazy"
          width="1100"
          height="1400"
        />
      </motion.figure>

      <motion.div
        className="campaign-moment-copy"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <p className="eyebrow">Cuidado consciente</p>
        <h2>La rutina cambia cuando el cuidado <em>se disfruta.</em></h2>
        <p>
          BRAIMARÚ propone momentos simples: una textura agradable, un aroma cálido y un gesto que devuelve atención al cuerpo.
        </p>
        <div className="campaign-moment-notes" aria-label="Principios de la experiencia">
          <span>Textura</span>
          <span>Aroma</span>
          <span>Bienestar</span>
        </div>
      </motion.div>
    </section>
  );
}
