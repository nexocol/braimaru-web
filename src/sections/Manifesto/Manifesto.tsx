export function Manifesto() {
  return (
    <section className="manifesto section-shell">
      <div className="manifesto-visual" aria-hidden="true">
        <motion.img
          src="/editorial/exfoliante-cafe-v11.webp"
          alt=""
          loading="eager"
          width="700"
          height="629"
          initial={{ opacity: 1, scale: 1.02 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="manifesto-content">
        <p className="eyebrow">Nuestra esencia</p>
        <h2>Tu piel,<br /><em>nuestra inspiración.</em></h2>
        <p className="manifesto-copy">
          BRAIMARÚ presenta el cuidado como un ritual cercano, sensorial y conectado con ingredientes
          de origen natural presentes en su identidad.
        </p>
      </div>
    </section>
  );
}
