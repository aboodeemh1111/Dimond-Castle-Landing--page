import NavbarServer from "../../components/NavbarServer";
import Footer from "../../components/Footer";
import ProductPageContent from "../../components/ProductPageContent";
import { getPublicProductBySlug } from "../../lib/products-api";
import { getCloudinaryUrl } from "../../lib/cloudinary";
import { notFound } from "next/navigation";

type PageParams = { slug: string };
type PageProps = {
  params: PageParams | Promise<PageParams>;
};

async function resolveParams(params: PageProps["params"]): Promise<PageParams> {
  return await params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await resolveParams(params);
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title =
    product.en.seo?.title ||
    product.ar.seo?.title ||
    product.en.name ||
    product.ar.name;
  const description =
    product.en.seo?.description ||
    product.ar.seo?.description ||
    product.en.description ||
    product.ar.description;
  const ogImage =
    product.en.seo?.ogImage ||
    product.ar.seo?.ogImage ||
    (product.coverPublicId
      ? getCloudinaryUrl(product.coverPublicId, {
          width: 1200,
          height: 630,
          crop: "fit",
        })
      : undefined);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await resolveParams(params);
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <NavbarServer />
      <ProductPageContent product={product} />
      <Footer />
    </>
  );
}

