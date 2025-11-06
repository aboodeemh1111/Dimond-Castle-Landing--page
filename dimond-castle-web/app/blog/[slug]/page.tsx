import NavbarServer from "../../components/NavbarServer";
import Footer from "../../components/Footer";
import { getBlogBySlug, type BlogPost } from "../../lib/public-blogs";
import Image from "next/image";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 0; // Disable caching for development

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Not found" };
  const title = post.en.seo?.title || post.en.title;
  const description = post.en.seo?.description || post.en.excerpt || undefined;
  return { title, description };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
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
      <main className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        {/* Hero Header */}
        <header className="mb-12 space-y-6">
          {/* Cover Image */}
          {post.coverPublicId && (
            <div className="relative h-[300px] sm:h-[400px] w-full overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={`https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/${post.coverPublicId}.jpg`}
                alt={post.en.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
              />
            </div>
          )}
          
          {/* Title & Meta */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              {post.en.title}
            </h1>
            {post.en.excerpt && (
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {post.en.excerpt}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              {post.author && <span className="font-medium">{post.author}</span>}
              <span>•</span>
              <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-img:rounded-2xl prose-img:shadow-lg">
          <BlogBlocks blocks={post.en.blocks} />
        </article>
      </main>
      <Footer />
    </>
  );
}

function BlogBlocks({ blocks }: { blocks: BlogPost["en"]["blocks"] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag
                key={i}
                className="text-3xl font-bold text-slate-900 mt-12 mb-4"
              >
                {block.text}
              </HeadingTag>
            );

          case "paragraph":
            return (
              <p key={i} className="text-lg leading-relaxed text-slate-700">
                {block.text}
              </p>
            );

          case "image":
            return (
              <figure key={i} className="my-8">
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={`https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/${block.publicId}.jpg`}
                    alt={block.alt || ""}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 896px, 100vw"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "video":
            return (
              <div key={i} className="my-8">
                <video
                  controls
                  className="w-full rounded-2xl shadow-lg"
                  poster={
                    block.posterId
                      ? `https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/${block.posterId}.jpg`
                      : undefined
                  }
                >
                  <source
                    src={`https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/${block.publicId}.mp4`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                {block.caption && (
                  <p className="mt-3 text-center text-sm text-slate-500 italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case "link":
            return (
              <div key={i} className="my-6 text-center">
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl hover:scale-105"
                >
                  {block.label || block.url}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            );

          case "list":
            return block.ordered ? (
              <ol
                key={i}
                className="list-decimal space-y-3 pl-8 text-lg text-slate-700 marker:font-semibold marker:text-emerald-600"
              >
                {block.items.map((item, idx) => (
                  <li key={idx} className="pl-2">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul
                key={i}
                className="list-disc space-y-3 pl-8 text-lg text-slate-700 marker:text-emerald-600"
              >
                {block.items.map((item, idx) => (
                  <li key={idx} className="pl-2">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="my-8 rounded-2xl border-l-4 border-emerald-500 bg-emerald-50/80 p-8 text-xl italic text-emerald-900 shadow-sm"
              >
                <p className="mb-0">{block.text}</p>
                {block.cite && (
                  <footer className="mt-4 text-base font-semibold not-italic text-emerald-700">
                    — {block.cite}
                  </footer>
                )}
              </blockquote>
            );

          case "divider":
            return (
              <hr
                key={i}
                className="my-12 border-t-2 border-slate-200"
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}


