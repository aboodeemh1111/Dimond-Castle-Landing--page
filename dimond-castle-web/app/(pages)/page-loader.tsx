import NavbarServer from "../components/NavbarServer";
import Footer from "../components/Footer";
import BlockRenderer from "../components/blocks/BlockRenderer";
import { getPublicPageBySlug, type PublicPage } from "../lib/public-pages";
import { getPageBySlug } from "../lib/pages-api";
import { PageRenderer } from "../components/PageRenderer";

const RESERVED = new Set(["admin", "login", "blog", "blogs"]);

function normalizeSegments(slugSegments: string[]) {
  return slugSegments.map((segment) => segment?.trim()).filter((segment): segment is string => Boolean(segment));
}

function buildSlugVariants(slugSegments: string[]) {
  const cleaned = normalizeSegments(slugSegments);
  if (cleaned.length === 0) {
    return { cleaned, builderSlug: "/", legacySlug: "" };
  }
  const joined = cleaned.join("/");
  return {
    cleaned,
    builderSlug: `/${joined}`,
    legacySlug: joined,
  };
}

export async function generatePageMetadata(slugSegments: string[]) {
  const { cleaned, builderSlug, legacySlug } = buildSlugVariants(slugSegments);
  if (cleaned.length === 0 || RESERVED.has(cleaned[0])) return {};

  const builderPage = await getPageBySlug(builderSlug);
  if (builderPage) {
    const title = builderPage.en.seo?.title || builderPage.en.title;
    const description = builderPage.en.seo?.description || undefined;
    return { title, description };
  }

  const page = await getPublicPageBySlug(legacySlug);
  if (!page) return { title: "Not found" };
  const title = page.en.seo?.title || page.en.title;
  const description = page.en.seo?.description || page.en.excerpt || undefined;
  return { title, description };
}

export async function renderDynamicPage(slugSegments: string[]) {
  const { cleaned, builderSlug, legacySlug } = buildSlugVariants(slugSegments);
  if (cleaned.length === 0 || RESERVED.has(cleaned[0])) return null;

  const builderPage = await getPageBySlug(builderSlug);
  if (builderPage) {
    return (
      <>
        <NavbarServer />
        <PageRenderer page={builderPage} locale="en" />
        <Footer />
      </>
    );
  }

  const page: PublicPage | null = await getPublicPageBySlug(legacySlug);
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


