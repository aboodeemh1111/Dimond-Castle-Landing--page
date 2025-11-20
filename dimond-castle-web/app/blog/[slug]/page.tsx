"use client";

import NavbarServer from "../../components/NavbarServer";
import Footer from "../../components/Footer";
import { getBlogBySlug, type BlogPost } from "../../lib/public-blogs";
import Image from "next/image";
import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from "../../lib/cloudinary";
import { useI18n } from "../../components/I18nProvider";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language, dir } = useI18n();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const data = await getBlogBySlug(slug);
        setPost(data);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      const title = post[language].title;
      document.title = `${title} | Dimond Castle`;
    }
  }, [post, language]);

  if (loading) {
    return (
      <>
        <NavbarServer />
        <main className="mx-auto min-h-[50vh] max-w-5xl px-4 py-20 text-center">
          <div className="text-lg text-slate-600">Loading...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <NavbarServer />
        <main className="mx-auto min-h-[50vh] max-w-5xl px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            {language === "ar" ? "المقال غير موجود" : "Post not found"}
          </h1>
        </main>
        <Footer />
      </>
    );
  }

  const content = post[language];

  return (
    <>
      <NavbarServer />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:py-20" dir={dir}>
        {/* Hero Header */}
        <header className="mb-12 space-y-6">
          {/* Cover Image */}
          {post.coverPublicId && (
            <div className="relative h-[300px] sm:h-[400px] w-full overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={getCloudinaryImageUrl(post.coverPublicId, 'f_auto,q_auto,w_1200')}
                alt={content.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
                unoptimized
              />
            </div>
          )}
          
          {/* Title & Meta */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              {content.title}
            </h1>
            {content.excerpt && (
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {content.excerpt}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              {post.author && <span className="font-medium">{post.author}</span>}
              <span>•</span>
              <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
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
          <BlogBlocks blocks={content.blocks} language={language} />
        </article>
      </main>
      <Footer />
    </>
  );
}

function BlogBlocks({ blocks, language }: { blocks: BlogPost["en"]["blocks"]; language: "en" | "ar" }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return block.level === 2 ? (
              <h2
                key={i}
                className="text-3xl font-bold text-slate-900 mt-12 mb-4"
              >
                {block.text}
              </h2>
            ) : (
              <h3
                key={i}
                className="text-3xl font-bold text-slate-900 mt-12 mb-4"
              >
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={i} className="text-lg leading-relaxed text-slate-700">
                {block.text}
              </p>
            );

          case "image":
            if (!block.publicId) return null;
            return (
              <figure key={i} className="my-8">
                <div
                  className="mx-auto"
                  style={{ width: `${typeof (block as any).widthPercent === 'number' ? (block as any).widthPercent : 100}%` }}
                >
                  <div
                    className="relative w-full overflow-hidden rounded-2xl shadow-lg"
                    style={{ height: `${typeof (block as any).heightPx === 'number' ? (block as any).heightPx : 400}px` }}
                  >
                    <Image
                      src={getCloudinaryImageUrl(block.publicId, 'f_auto,q_auto,w_1200')}
                      alt={block.alt || ""}
                      fill
                      className="object-contain object-center"
                      sizes="(min-width: 1024px) 896px, 100vw"
                      unoptimized
                    />
                  </div>
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-center text-sm text-slate-500 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "video":
            if (!block.publicId) return null;
            return (
              <div key={i} className="my-8">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  controls
                  className="w-full rounded-2xl shadow-lg"
                  poster={
                    block.posterId
                      ? getCloudinaryImageUrl(block.posterId, 'f_auto,q_auto')
                      : undefined
                  }
                >
                  <source
                    src={getCloudinaryVideoUrl(block.publicId)}
                    type="video/mp4"
                  />
                  {language === "ar" 
                    ? "متصفحك لا يدعم تشغيل الفيديو."
                    : "Your browser does not support the video tag."}
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
