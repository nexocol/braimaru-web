import { motion } from 'motion/react';

export function EditorialMoment() {
  return (
    <section id="historia" className="editorial-section">
      <div className="editorial-image">
        <img
          src="/products/aceite-corporal-01.webp"
          alt="Aceite corporal BRAIMARÚ de canela y clavos de olor"
          loading="lazy"
          width="780"
          height="900"
        />
      </div>

      <motion.div className="editorial-copy" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        <p className="eyebrow">Cuidado consciente</p>
        <h2>Natural no tiene que sentirse simple.</h2>
        <p>BRAIMARÚ reúne cuidado corporal y capilar dentro de una identidad cálida que pone el bienestar en primer plano.</p>
        <span className="editorial-index">BRAIMARÚ / 2026</span>
      </motion.div>
    </section>
  );
}
