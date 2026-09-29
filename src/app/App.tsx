import { Header } from '../components/Header/Header';
import { products } from '../data/products';
import { Footer } from '../layout/Footer/Footer';
import { Catalog } from '../sections/Catalog/Catalog';
import { ClosingCTA } from '../sections/ClosingCTA/ClosingCTA';
import { EditorialMoment } from '../sections/EditorialMoment/EditorialMoment';
import { FeaturedProducts } from '../sections/FeaturedProducts/FeaturedProducts';
import { Hero } from '../sections/Hero/Hero';
import { Manifesto } from '../sections/Manifesto/Manifesto';
import { RitualExplorer } from '../sections/RitualExplorer/RitualExplorer';

export function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <FeaturedProducts products={products} />
        <EditorialMoment />
        <RitualExplorer products={products} />
        <Catalog products={products} />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
