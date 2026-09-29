import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { products } from '../data/products';
import { buildWhatsAppUrl } from '../lib/whatsapp';
import type { Product, RitualTag } from '../types/catalog';

gsap.registerPlugin(ScrollTrigger);

const rituals: { id: RitualTag; label: string; copy: string; image: string }[] = [
  { id: 'hidratar', label: 'Hidratar', copy: 'Rituales asociados a productos con referencias visibles a hidratación.', image: '/products/aceite-corporal-01.webp' },
  { id: 'nutrir', label: 'Nutrir', copy: 'Cuidado nutritivo identificado dentro de la línea capilar.', image: '/products/tratamiento-capilar.webp' },
  { id: 'exfoliar', label: 'Exfoliar', copy: 'Opciones de exfoliación identificadas en la línea de jabones.', image: '/products/aceite-corporal-01.webp' },
  { id: 'cuidado-corporal', label: 'Cuidado corporal', copy: 'Aceites corporales para convertir el cuidado en un momento propio.', image: '/products/aceite-corporal-01.webp' },
  { id: 'cuidado-capilar', label: 'Cuidado capilar', copy: 'Shampoo y tratamiento de la línea capilar BRAIMARÚ.', image: '/products/shampoo-capilar.webp' },
];

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><a className="brand-lockup" href="#inicio" aria-label="BRAIMARÚ, ir al inicio">BRAIMARÚ</a><button className="menu-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="primary-nav">{open?'Cerrar':'Menú'}</button><nav id="primary-nav" className={open?'nav open':'nav'} aria-label="Navegación principal"><a href="#productos" onClick={()=>setOpen(false)}>Productos</a><a href="#ritual" onClick={()=>setOpen(false)}>Tu ritual</a><a href="#historia" onClick={()=>setOpen(false)}>Nuestra esencia</a><a className="nav-cta" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">WhatsApp</a></nav></header>;
}

function Hero() {
  const root=useRef<HTMLElement>(null);
  const reduced=useReducedMotion();

  useEffect(()=>{
    if(!root.current||reduced) return;
    const ctx=gsap.context(()=>{
      gsap.from('[data-hero-reveal]',{y:36,opacity:0,duration:1,stagger:.12,ease:'power3.out'});
      gsap.from('.hero-visual-main',{scale:1.06,opacity:0,duration:1.25,ease:'power3.out'});
      gsap.to('.hero-visual-main',{yPercent:5,ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:.5}});
    },root);
    return()=>ctx.revert();
  },[reduced]);

  return <section id="inicio" className="hero" ref={root}><div className="hero-grid-lines" aria-hidden="true"/><div className="hero-kicker" data-hero-reveal>Cosmética natural · Colombia</div><h1 className="hero-title" data-hero-reveal><span>Belleza</span><span>natural.</span></h1><div className="hero-visual-wrap" aria-hidden="true"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><img className="hero-visual-main" src="/products/aceite-corporal-01.webp" alt="" width="780" height="900" fetchPriority="high"/><img className="hero-logo-stamp" src="/brand/braimaru-logo.webp" alt="" width="420" height="300"/></div><div className="hero-copy" data-hero-reveal><p>Bienestar real en fórmulas y rituales inspirados en el cuidado consciente.</p><div className="hero-actions"><a className="button primary" href="#productos">Descubrir productos <Arrow/></a><a className="button ghost" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">Hablar por WhatsApp</a></div></div><div className="hero-footnote" data-hero-reveal>01 — Belleza natural, bienestar real</div></section>;
}

function ProductCard({product,priority=false}:{product:Product;priority?:boolean}) {
  return <motion.article className="product-card" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.55}}><div className="product-media"><img src={product.image} alt={product.imageAlt} loading={priority?'eager':'lazy'} width="780" height="900"/></div><div className="product-meta"><p className="eyebrow">{product.category.replaceAll('-',' ')}</p><h3>{product.name}</h3><p>{product.shortDescription}</p><div className="product-actions"><span className="price-pending">Precio por WhatsApp</span><a className="text-link" href={buildWhatsAppUrl({productName:product.name})} target="_blank" rel="noreferrer">Consultar <Arrow/></a></div></div></motion.article>;
}

function RitualExplorer(){
  const [active,setActive]=useState<RitualTag>('cuidado-corporal');
  const current=rituals.find(r=>r.id===active)!;
  const matched=useMemo(()=>products.filter(p=>p.ritualTags.includes(active)).slice(0,3),[active]);

  return <section id="ritual" className="ritual section-shell"><div className="ritual-top"><div><p className="eyebrow">Encuentra tu ritual</p><h2>¿Qué necesita tu momento de cuidado?</h2></div><p>Explora por intención. Las asociaciones se basan únicamente en información visible en los assets recibidos.</p></div><div className="ritual-tabs" role="tablist" aria-label="Necesidad de cuidado">{rituals.map(r=><button key={r.id} role="tab" aria-selected={active===r.id} onClick={()=>setActive(r.id)}>{r.label}</button>)}</div><div className="ritual-stage"><AnimatePresence mode="wait"><motion.div key={active} className="ritual-image" initial={{opacity:0,clipPath:'inset(8% 0 8% 0)'}} animate={{opacity:1,clipPath:'inset(0% 0 0% 0)'}} exit={{opacity:0}} transition={{duration:.5}}><img src={current.image} alt="" loading="lazy"/></motion.div></AnimatePresence><div className="ritual-content"><span className="ritual-number">0{rituals.findIndex(r=>r.id===active)+1}</span><h3>{current.label}</h3><p>{current.copy}</p><div className="ritual-products">{matched.length?matched.map(p=><span key={p.id}>{p.name}</span>):<span>Sin producto asociado por ahora</span>}</div></div></div></section>;
}

export function App(){
  const featured=products.filter(p=>p.featured&&p.active);
  return <><Header/><main><Hero/><section className="manifesto section-shell"><p className="eyebrow">Nuestra esencia</p><motion.h2 initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}}>Tu piel,<br/><em>nuestra inspiración.</em></motion.h2><p className="manifesto-copy">BRAIMARÚ entiende el cuidado como un ritual: cercano, sensorial y conectado con ingredientes de origen natural presentes en su identidad.</p></section><section id="productos" className="products-section section-shell"><div className="section-heading"><div><p className="eyebrow">Selección BRAIMARÚ</p><h2>Cuida lo que habitas.</h2></div><p>Una primera selección construida únicamente con productos identificados en el material original de la marca.</p></div><div className="product-grid">{featured.map((p,i)=><ProductCard key={p.id} product={p} priority={i===0}/>)}</div></section><section id="historia" className="editorial-section"><div className="editorial-image"><img src="/products/tratamiento-capilar.webp" alt="Tratamiento capilar BRAIMARÚ en una composición de producto e ingredientes naturales" loading="lazy" width="780" height="520"/></div><motion.div className="editorial-copy" initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><p className="eyebrow">Cuidado consciente</p><h2>Natural no tiene que sentirse simple.</h2><p>Texturas, aromas y rutinas de cuidado se encuentran en una identidad cálida que pone el bienestar en primer plano.</p><span className="editorial-index">BRAIMARÚ / 2026</span></motion.div></section><RitualExplorer/><section className="catalog section-shell"><div className="section-heading"><div><p className="eyebrow">Catálogo visual</p><h2>Rituales para piel, cuerpo y cabello.</h2></div><p>Esta V1 usa fixtures tipados; la siguiente fase sustituirá la fuente por D1 sin rehacer los componentes.</p></div><div className="catalog-grid">{products.filter(p=>p.active).map(p=><ProductCard key={p.id} product={p}/>)}</div></section><section className="closing"><p className="eyebrow">BRAIMARÚ</p><h2>Belleza natural,<br/><em>bienestar real.</em></h2><a className="button primary light" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">Hablar con la marca <Arrow/></a></section></main><footer className="footer"><div className="footer-brand">BRAIMARÚ</div><p>Cosmética natural · Colombia</p><p>© 2026 BRAIMARÚ</p></footer></>;
}
