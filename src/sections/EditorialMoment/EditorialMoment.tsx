import { motion } from 'motion/react';

export function EditorialMoment() {
  return (
    <section id="editorial" className="campaign-moment">
      <motion.figure
        className="campaign-moment-media"
        initial={{ opacity: 0, clipPath: 'inset(6% 2% 6% 2% round 3rem)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0rem)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85 }}
      >
        <img
          src="/products/catalog/aceite-naranja-calendula.webp"
          alt="Ritual corporal BRAIMARÚ con aceite de Caléndula y Naranja"
          loading="lazy"
          width="1100"
          height="1400"
          onError={(event) => {
            if (event.currentTarget.dataset.fallbackApplied) return;
            event.currentTarget.dataset.fallbackApplied = 'true';
            event.currentTarget.src = '/editorial/cafe-naranja-campaign.webp';
          }}
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
        <h2>Tu rutina puede sentirse <em>mucho mejor.</em></h2>
        <p>
          Una textura agradable, un aroma cálido y unos minutos para ti. No hace falta complicar el cuidado para hacerlo especial.
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
