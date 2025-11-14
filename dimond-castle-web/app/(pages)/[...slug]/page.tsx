import { generatePageMetadata, renderDynamicPage } from "../page-loader";

type PageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generatePageMetadata(slug ?? []);
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  return renderDynamicPage(slug ?? []);
}


