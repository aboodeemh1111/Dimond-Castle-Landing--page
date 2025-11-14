import { generatePageMetadata, renderDynamicPage } from "../(pages)/page-loader";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generatePageMetadata(slug ? [slug] : []);
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  return renderDynamicPage(slug ? [slug] : []);
}

