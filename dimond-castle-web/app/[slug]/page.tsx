import NavbarServer from "../components/NavbarServer";
import Footer from "../components/Footer";
import BlockRenderer from "../components/blocks/BlockRenderer";
import { getPublicPageBySlug, type PublicPage } from "../lib/public-pages";
import { getPageBySlug, type Page } from "../lib/pages-api";
import { PageRenderer } from "../components/PageRenderer";

type PageProps = { params: Promise<{ slug: string }> };

const RESERVED = new Set(["admin", "login", "blog", "blogs"]);

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  
  // Try new page builder first
  const builderPage = await getPageBySlug(`/${slug}`);
  if (builderPage) {
    const title = builderPage.en.seo?.title || builderPage.en.title;
    const description = builderPage.en.seo?.description || undefined;
    return { title, description };
  }
  
  // Fallback to old system
  const page = await getPublicPageBySlug(slug);
  if (!page) return { title: "Not found" };
  const title = page.en.seo?.title || page.en.title;
  const description = page.en.seo?.description || page.en.excerpt || undefined;
  return { title, description };
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED.has(slug)) return null;
  
  // Try new page builder first
  const builderPage = await getPageBySlug(`/${slug}`);
  if (builderPage) {
    return (
      <>
        <NavbarServer />
        <PageRenderer page={builderPage} locale="en" />
        <Footer />
      </>
    );
  }
  
  // Fallback to old system
  const page: PublicPage | null = await getPublicPageBySlug(slug);
  if (!page) {
    return (
      <>
        <NavbarServer />
        <main className="mx-auto min-h-[50vh] max-w-5xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
          <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarServer />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">{page.en.title}</h1>
          {page.en.excerpt && <p className="mt-3 text-slate-600">{page.en.excerpt}</p>}
        </header>
        <article className="prose prose-slate max-w-none prose-headings:scroll-mt-20">
          <BlockRenderer blocks={page.en.blocks} locale="en" />
        </article>
      </main>
      <Footer />
    </>
  );
}
