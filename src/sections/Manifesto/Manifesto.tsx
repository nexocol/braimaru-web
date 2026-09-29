import { motion } from 'motion/react';

export function Manifesto() {
  return (
    <section className="manifesto section-shell">
      <p className="eyebrow">Nuestra esencia</p>
      <motion.h2 initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        Tu piel,<br /><em>nuestra inspiración.</em>
      </motion.h2>
      <p className="manifesto-copy">
        BRAIMARÚ presenta el cuidado como un ritual cercano, sensorial y conectado con ingredientes de origen natural presentes en su identidad.
      </p>
    </section>
  );
}
