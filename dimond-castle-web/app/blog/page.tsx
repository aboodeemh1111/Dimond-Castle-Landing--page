"use client";

import NavbarServer from "../components/NavbarServer";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getPublishedBlogs } from "../lib/public-blogs";
import { getCloudinaryImageUrl } from "../lib/cloudinary";
import { useI18n } from "../components/I18nProvider";
import { useEffect, useState } from "react";
import type { BlogPost } from "../lib/public-blogs";

export default function BlogIndexPage() {
  const { language, dir } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const data = await getPublishedBlogs();
        setPosts(data);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const t = {
    en: {
      title: "Blog",
      subtitle: "Latest insights, updates, and stories from Diamond Castle",
      noPosts: "No posts yet",
      noPostsSub: "Check back soon for our latest updates!",
      readMore: "Read more",
    },
    ar: {
      title: "المدونة",
      subtitle: "آخر الأفكار والتحديثات والقصص من قلعة الألماس",
      noPosts: "لا توجد مقالات بعد",
      noPostsSub: "تحقق مرة أخرى قريبًا لآخر التحديثات!",
      readMore: "اقرأ المزيد",
    },
  };

  return (
    <>
      <NavbarServer />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:py-20" dir={dir}>
        {/* Hero Header */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4">
            {t[language].title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t[language].subtitle}
          </p>
        </header>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid place-items-center py-24 text-center">
            <div className="text-lg text-slate-600">Loading...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border-2 border-dashed border-slate-200 py-24 text-center">
            <div className="space-y-4">
              <div className="text-6xl">📝</div>
              <h3 className="text-2xl font-semibold text-slate-900">{t[language].noPosts}</h3>
              <p className="text-slate-600">{t[language].noPostsSub}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const content = post[language];
              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Cover Image */}
                  {post.coverPublicId ? (
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={getCloudinaryImageUrl(post.coverPublicId, 'f_auto,q_auto,w_600')}
                        alt={content.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-56 w-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {content.title}
                    </h2>

                    {/* Excerpt */}
                    {content.excerpt && (
                      <p className="text-slate-600 line-clamp-3 leading-relaxed">
                        {content.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 pt-3 text-sm text-slate-500 border-t border-slate-100">
                      {post.author && (
                        <span className="font-medium">{post.author}</span>
                      )}
                      {post.author && <span>•</span>}
                      <time dateTime={post.updatedAt}>
                        {new Date(post.updatedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    {/* Read More */}
                    <div className="pt-2">
                      <span className={`inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:gap-3 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        {t[language].readMore}
                        <svg
                          className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}


