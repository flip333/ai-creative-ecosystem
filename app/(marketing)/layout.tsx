import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Chrome de la landing pública.
 *
 * Vive aquí y no en el layout raíz porque /portal, /admin y /login tienen
 * su propio chrome a pantalla completa: el Navbar fijo se montaba encima
 * del sidebar del portal.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
