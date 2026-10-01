import { lazy, Suspense, useEffect, useState } from 'react';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp/FloatingWhatsApp';
import { Header } from '../components/Header/Header';
import { PointerAura } from '../components/PointerAura/PointerAura';
import { StorefrontIntro } from '../components/StorefrontIntro/StorefrontIntro';
import { QuickViewProvider } from '../components/ProductQuickView/QuickViewProvider';
import { useStorefrontData } from '../hooks/useStorefrontData';
import { Footer } from '../layout/Footer/Footer';
import { refreshScrollTriggers } from '../lib/motion';
import { BRAIMARU_WHATSAPP_PHONE } from '../lib/whatsapp';
import { BrandStory } from '../sections/BrandStory/BrandStory';
import { Catalog } from '../sections/Catalog/Catalog';
import { CategoryShowcase } from '../sections/CategoryShowcase/CategoryShowcase';
import { ClosingCTA } from '../sections/ClosingCTA/ClosingCTA';
import { EditorialMoment } from '../sections/EditorialMoment/EditorialMoment';
import { FeaturedProducts } from '../sections/FeaturedProducts/FeaturedProducts';
import { Hero } from '../sections/Hero/Hero';
import { Manifesto } from '../sections/Manifesto/Manifesto';
import { RitualExplorer } from '../sections/RitualExplorer/RitualExplorer';

const LazyAdminApp = lazy(() => import('../admin/AdminApp').then((module) => ({ default: module.AdminApp })));
const LazyAdminLogin = lazy(() => import('../admin/AdminLogin').then((module) => ({ default: module.AdminLogin })));

function AdminFallback() {
  return (
    <main className="storefront-state" aria-live="polite">
      <p className="eyebrow">BRAIMARÚ</p>
      <h1>Cargando administración.</h1>
    </main>
  );
}

function StorefrontApp() {
  const storefront = useStorefrontData();
  const [introDone, setIntroDone] = useState(false);
  const site = {
    ...storefront.site,
    whatsapp_phone: storefront.site.whatsapp_phone ?? BRAIMARU_WHATSAPP_PHONE,
  };
  const phone = site.whatsapp_phone;

  useEffect(() => {
    // fonts and lazy images change section heights: keep scroll scenes aligned
    const refresh = () => refreshScrollTriggers();
    void document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  const ready = !storefront.loading;
  const revealClassName = `storefront-reveal${introDone ? ' is-visible' : ''}`;

  if (storefront.loading) {
    return (
      <>
        <StorefrontIntro ready={false} onComplete={() => setIntroDone(true)} />
        <main className="storefront-underlay" aria-hidden="true" />
      </>
    );
  }

  if (storefront.error) {
    return (
      <>
        <StorefrontIntro ready={ready} onComplete={() => setIntroDone(true)} />
        <div className={revealClassName}>
          <Header phone={phone} />
          <main className="storefront-state" role="alert">
            <p className="eyebrow">BRAIMARÚ</p>
            <h1>Volvamos a intentarlo en un momento.</h1>
            <p>{storefront.error}</p>
          </main>
          <Footer site={site} />
        </div>
      </>
    );
  }

  return (
    <>
      <StorefrontIntro ready={ready} onComplete={() => setIntroDone(true)} />
      <div className={revealClassName}>
        <QuickViewProvider phone={phone}>
          <div data-catalog-source={storefront.source ?? undefined}>
            <PointerAura />
            <Header phone={phone} />
            <FloatingWhatsApp phone={phone} />
            <main>
              <Hero phone={phone} products={storefront.products} />
              <Manifesto />
              <CategoryShowcase products={storefront.products} />
              <FeaturedProducts products={storefront.products} />
              <EditorialMoment />
              <RitualExplorer products={storefront.products} phone={phone} />
              <BrandStory />
              <Catalog products={storefront.products} phone={phone} />
              <ClosingCTA phone={phone} />
            </main>
            <Footer site={site} />
          </div>
        </QuickViewProvider>
      </div>
    </>
  );
}

export function App() {
  if (window.location.pathname === '/admin/login') {
    return (
      <Suspense fallback={<AdminFallback />}>
        <LazyAdminLogin />
      </Suspense>
    );
  }

  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={<AdminFallback />}>
        <LazyAdminApp />
      </Suspense>
    );
  }

  return <StorefrontApp />;
}
