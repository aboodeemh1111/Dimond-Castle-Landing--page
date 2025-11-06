import Image from "next/image";
import type { Block, Locale } from "../../lib/public-pages";

export default function BlockRenderer({ blocks, locale }: { blocks: Block[]; locale: Locale }) {
  return (
    <div className="space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const key = `${block.type}-${index}`;
            const className = "font-semibold text-slate-900 mt-8";
            if (block.level === 1) {
              return <h1 key={key} className={className}>{block.text}</h1>;
            } else if (block.level === 2) {
              return <h2 key={key} className={className}>{block.text}</h2>;
            } else if (block.level === 3) {
              return <h3 key={key} className={className}>{block.text}</h3>;
            } else {
              return <h4 key={key} className={className}>{block.text}</h4>;
            }
          }
          case "paragraph":
            return (
              <p key={`${block.type}-${index}`} className="leading-7 text-slate-700">
                {block.text}
              </p>
            );
          case "image":
            return (
              <figure key={`${block.type}-${index}`} className="mt-6">
                <div className="relative h-[360px] w-full overflow-hidden rounded-3xl">
                  <Image
                    src={`https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/${block.publicId}.jpg`}
                    alt={block.alt ?? ""}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 800px, 100vw"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-slate-500">{block.caption}</figcaption>
                )}
              </figure>
            );
          case "video":
            return (
              <div key={`${block.type}-${index}`} className="mt-6">
                <video controls className="w-full rounded-3xl">
                  <source
                    src={`https://res.cloudinary.com/demo/video/upload/f_auto,q_auto,w_1280/${block.publicId}.mp4`}
                    type="video/mp4"
                  />
                </video>
              </div>
            );
          case "list":
            return block.ordered ? (
              <ol key={`${block.type}-${index}`} className="list-decimal space-y-1 pl-6 text-slate-700">
                {block.items.map((item, i) => (
                  <li key={`${item}-${i}`}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={`${block.type}-${index}`} className="list-disc space-y-1 pl-6 text-slate-700">
                {block.items.map((item, i) => (
                  <li key={`${item}-${i}`}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={`${block.type}-${index}`}
                className="rounded-3xl border-l-4 border-emerald-500 bg-emerald-50/80 p-6 text-lg italic text-emerald-900"
              >
                {block.text}
                {block.cite && (
                  <cite className="mt-3 block text-sm font-semibold text-emerald-700">— {block.cite}</cite>
                )}
              </blockquote>
            );
          case "link":
            return (
              <a
                key={`${block.type}-${index}`}
                href={block.href}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white"
              >
                {block.label}
              </a>
            );
          case "divider":
            return <hr key={`${block.type}-${index}`} className="my-8 border-emerald-200" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
