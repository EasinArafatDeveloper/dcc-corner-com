import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { FloatingCartButton } from "@/components/shared/FloatingCartButton";
import { PopupOffer } from "@/components/storefront/PopupOffer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingCartButton />
      <CartDrawer />
      <PopupOffer />
    </div>
  );
}
