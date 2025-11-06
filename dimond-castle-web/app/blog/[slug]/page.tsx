import NavbarServer from "../../components/NavbarServer";
import Footer from "../../components/Footer";
import { getBlogBySlug, type BlogPost } from "../../lib/public-blogs";

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps) {
  const post = await getBlogBySlug(params.slug);
  if (!post) return { title: "Not found" };
  const title = post.en.seo?.title || post.en.title;
  const description = post.en.seo?.description || post.en.excerpt || undefined;
  return { title, description };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogBySlug(params.slug);
  if (!post) {
    return (
      <>
        <NavbarServer />
        <main className="mx-auto min-h-[50vh] max-w-5xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Post not found</h1>
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <NavbarServer />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">{post.en.title}</h1>
          {post.en.excerpt && <p className="mt-3 text-slate-600">{post.en.excerpt}</p>}
        </header>
        <article className="prose prose-slate max-w-none">
          <Blocks blocks={post.en.blocks} />
        </article>
      </main>
      <Footer />
    </>
  );
}

function Blocks({ blocks }: { blocks: BlogPost["en"]["blocks"] }) {
  return (
    <div>
      {blocks.map((b, i) => {
        if (b.type === "heading") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "paragraph") return <p key={i}>{b.text}</p>;
        if (b.type === "divider") return <hr key={i} />;
        if (b.type === "image")
          return (
            <figure key={i}>
              <img
                src={`https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/${b.publicId}.jpg`}
                alt={b.alt || ""}
              />
              {b.caption && (
                <figcaption className="text-sm text-slate-500">{b.caption}</figcaption>
              )}
            </figure>
          );
        if (b.type === "video")
          return (
            <video key={i} controls className="w-full">
              <source
                src={`https://res.cloudinary.com/demo/video/upload/${b.publicId}.mp4`}
              />
            </video>
          );
        if (b.type === "link")
          return (
            <p key={i}>
              <a
                className="text-emerald-700 underline"
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {b.label || b.url}
              </a>
            </p>
          );
        if (b.type === "list")
          return b.ordered ? (
            <ol key={i} className="list-decimal pl-6 space-y-1">
              {b.items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ol>
          ) : (
            <ul key={i} className="list-disc pl-6 space-y-1">
              {b.items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
          );
        if (b.type === "quote")
          return (
            <blockquote
              key={i}
              className="border-l-4 border-slate-300 pl-4 italic text-slate-600"
            >
              {b.text}
              {b.cite && (
                <footer className="mt-1 text-xs not-italic">— {b.cite}</footer>
              )}
            </blockquote>
          );
        return null;
      })}
    </div>
  );
}


