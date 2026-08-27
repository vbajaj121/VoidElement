import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { SearchPaletteLoader } from "@/components/commerce/search-palette-loader";
import { getProducts } from "@/lib/data/products.server";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Search palette is non-essential; don't take the whole storefront down if the DB hiccups.
  const products = await getProducts().catch(() => []);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <SearchPaletteLoader products={products} />
    </>
  );
}
