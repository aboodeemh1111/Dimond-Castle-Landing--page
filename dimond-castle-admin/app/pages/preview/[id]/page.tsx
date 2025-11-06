import Image from "next/image";
import { notFound } from "next/navigation";
import type { PageInput } from "../../../lib/pages";
import { fetchPageById } from "../../../lib/pages";
import type { Block } from "../../../lib/blogs";

type PreviewProps = { params: { id: string }; searchParams: { draft?: string } };

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as const;
      return <Tag className="mt-8 font-semibold text-slate-900" key={`${block.type}-${index}`}>{block.text}</Tag>;
    }
    case "paragraph":
      return <p className="mt-4 text-slate-600" key={`${block.type}-${index}`}>{block.text}</p>;
    case "image":
      return (
        <figure className="mt-6" key={`${block.type}-${index}`}>
          <div className="relative h-[360px] w-full overflow-hidden rounded-3xl">
            <Image src={`https://res.cloudinary.com/demo/image/upload/w_900,f_auto/${block.publicId}.jpg`} alt={block.alt ?? "Page image"} fill className="object-cover" sizes="(min-width: 1024px) 800px, 100vw" />
          </div>
          {block.caption && <figcaption className="mt-2 text-center text-sm text-slate-500">{block.caption}</figcaption>}
        </figure>
      );
    case "video":
      return (
        <div className="mt-6" key={`${block.type}-${index}`}>
          <video controls className="w-full rounded-3xl">
            <source src={`https://res.cloudinary.com/demo/video/upload/f_auto,q_auto/${block.publicId}.mp4`} type="video/mp4" />
          </video>
        </div>
      );
    case "list":
      return block.ordered ? (
        <ol className="mt-4 list-decimal space-y-1 pl-6 text-slate-600" key={`${block.type}-${index}`}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ol>
      ) : (
        <ul className="mt-4 list-disc space-y-1 pl-6 text-slate-600" key={`${block.type}-${index}`}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={`${block.type}-${index}`} className="mt-6 rounded-3xl border-l-4 border-emerald-500 bg-emerald-50/80 p-6 text-lg italic text-emerald-900">
          {block.text}
          {block.cite && <cite className="mt-3 block text-sm font-semibold text-emerald-700">— {block.cite}</cite>}
        </blockquote>
      );
    case "link":
      return <a key={`${block.type}-${index}`} href={block.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white">{block.label}</a>;
    case "divider":
      return <hr key={`${block.type}-${index}`} className="my-8 border-emerald-200" />;
    default:
      return null;
  }
}

export default async function PagePreview({ params, searchParams }: PreviewProps) {
  let content: PageInput | null = null;
  if (searchParams.draft) {
    try { content = JSON.parse(decodeURIComponent(searchParams.draft)) as PageInput; } catch (e) { /* ignore */ }
  }
  if (!content) {
    const page = await fetchPageById(params.id);
    if (!page) notFound();
    content = page;
  }
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-16">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-500">Dimond Castle</p>
        <h1 className="text-4xl font-semibold text-slate-900">{content.en.title}</h1>
        {content.en.excerpt && <p className="text-lg text-slate-600">{content.en.excerpt}</p>}
      </header>
      <article className="space-y-4 text-left text-slate-700">
        {content.en.blocks.map((block, i) => renderBlock(block, i))}
      </article>
    </main>
  );
}
