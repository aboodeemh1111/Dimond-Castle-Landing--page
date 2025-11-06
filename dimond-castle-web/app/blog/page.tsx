import NavbarServer from "../components/NavbarServer";
import Footer from "../components/Footer";
import Link from "next/link";
import { getPublishedBlogs } from "../lib/public-blogs";

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();
  return (
    <>
      <NavbarServer />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-semibold text-slate-900">Blog</h1>
          <p className="mt-2 text-slate-600">Latest updates from Dimond Castle</p>
        </header>
        {posts.length === 0 ? (
          <div className="grid place-items-center rounded-md border py-16 text-slate-600">No posts yet.</div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {posts.map((p) => (
              <li key={p._id} className="rounded-lg border p-5 hover:shadow-sm">
                <Link href={`/blog/${p.slug}`} className="block">
                  <h2 className="text-xl font-semibold text-slate-900">{p.en.title}</h2>
                  {p.en.excerpt && <p className="mt-2 line-clamp-3 text-slate-600">{p.en.excerpt}</p>}
                  <div className="mt-3 text-sm text-slate-500">{new Date(p.updatedAt).toLocaleDateString()}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}


