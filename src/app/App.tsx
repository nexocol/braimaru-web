import { AdminApp } from '../admin/AdminApp';
import { AdminLogin } from '../admin/AdminLogin';
import { Header } from '../components/Header/Header';
import { useStorefrontData } from '../hooks/useStorefrontData';
import { Footer } from '../layout/Footer/Footer';
import { Catalog } from '../sections/Catalog/Catalog';
import { ClosingCTA } from '../sections/ClosingCTA/ClosingCTA';
import { EditorialMoment } from '../sections/EditorialMoment/EditorialMoment';
import { FeaturedProducts } from '../sections/FeaturedProducts/FeaturedProducts';
import { Hero } from '../sections/Hero/Hero';
import { Manifesto } from '../sections/Manifesto/Manifesto';
import { RitualExplorer } from '../sections/RitualExplorer/RitualExplorer';

function StorefrontApp() {
  const storefront = useStorefrontData();
  const phone = storefront.site.whatsapp_phone;

  if (storefront.loading) {
    return (
      <>
        <Header phone={phone} />
        <main className="storefront-state" aria-live="polite">
          <p className="eyebrow">BRAIMARÚ</p>
          <h1>Preparando tu ritual.</h1>
        </main>
        <Footer site={storefront.site} />
      </>
    );
  }

  if (storefront.error) {
    return (
      <>
        <Header phone={phone} />
        <main className="storefront-state" role="alert">
          <p className="eyebrow">BRAIMARÚ</p>
          <h1>Volvamos a intentarlo en un momento.</h1>
          <p>{storefront.error}</p>
        </main>
        <Footer site={storefront.site} />
      </>
    );
  }

  return (
    <div data-catalog-source={storefront.source ?? undefined}>
      <Header phone={phone} />
      <main>
        <Hero phone={phone} />
        <Manifesto />
        <FeaturedProducts products={storefront.products} phone={phone} />
        <EditorialMoment />
        <RitualExplorer products={storefront.products} />
        <Catalog products={storefront.products} phone={phone} />
        <ClosingCTA phone={phone} />
      </main>
      <Footer site={storefront.site} />
    </div>
  );
}

export function App() {
  if (window.location.pathname === '/admin/login') {
    return <AdminLogin />;
  }

  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
    return <AdminApp />;
  }

  return <StorefrontApp />;
}
