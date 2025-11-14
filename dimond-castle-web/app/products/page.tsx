import type { Metadata } from "next";
import NavbarServer from "../components/NavbarServer";
import Footer from "../components/Footer";
import { getPublicProducts } from "../lib/products-api";
import ProductsArchive from "./ProductsArchive";

export const metadata: Metadata = {
  title: "White Diamond Rice Products | Diamond Castle",
  description:
    "Explore the complete White Diamond rice portfolio, compare SKUs, and discover the ideal product for your retail, wholesale, or food-service needs.",
};

export default async function ProductsPage() {
  const initialData = await getPublicProducts({ limit: 12, sort: "order" });

  return (
    <>
      <NavbarServer />
      <ProductsArchive initialData={initialData} />
      <Footer />
    </>
  );
}


