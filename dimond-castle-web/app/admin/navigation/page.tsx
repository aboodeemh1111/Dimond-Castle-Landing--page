"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";

type NavTreeItem = {
  labelEN: string;
  labelAR: string;
  href: string;
  visible?: boolean;
  newTab?: boolean;
  children?: NavTreeItem[];
};

type NavTreeResponse = {
  name: string;
  items: NavTreeItem[];
};

function filterVisible(items: NavTreeItem[]): NavTreeItem[] {
  return items
    .filter((i) => i.visible !== false)
    .map((i) => ({
      ...i,
      children: i.children ? filterVisible(i.children) : [],
    }));
}

export default function NavigationPage() {
  const [data, setData] = useState<NavTreeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiGet<NavTreeResponse>("/api/navigation/public/main");
        if (!mounted) return;
        setData(res);
      } catch (err) {
        if (!mounted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load navigation";
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Navigation</h1>
      <p className="text-sm text-gray-600">
        Below is a live preview of the current public navbar and its structure.
      </p>

      {/* Current Navbar preview */}
      <div className="rounded-2xl bg-white shadow-sm p-5 text-sm text-gray-700 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Current Navbar
            </h2>
            <p className="text-xs text-gray-500">
              This preview uses the same data and order as the main website
              navbar.
            </p>
          </div>
          {!loading && data && (
            <p className="text-xs text-gray-500">
              {filterVisible(data.items).length} visible top-level item
              {filterVisible(data.items).length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading && (
          <div className="text-gray-500">Loading navigation&hellip;</div>
        )}

        {!loading && error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700">
            Failed to load navigation: {error}
          </div>
        )}

        {!loading && !error && (!data || data.items.length === 0) && (
          <div className="text-gray-500">
            No navigation items found for the main navbar.
          </div>
        )}

        {!loading &&
          !error &&
          data &&
          filterVisible(data.items).length > 0 && (
            <CurrentNavbarPreview items={filterVisible(data.items)} />
          )}
      </div>

      {/* Structural tree view */}
      {!loading && !error && data && data.items.length > 0 && (
        <div className="rounded-2xl bg-white shadow-sm p-5 text-sm text-gray-700">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Nav set
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {data.name || "Main"}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {data.items.length} top-level item
              {data.items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <NavTreeList items={data.items} />
        </div>
      )}
    </div>
  );
}

function CurrentNavbarPreview({ items }: { items: NavTreeItem[] }) {
  return (
    <div className="border border-[var(--dc-gray)] rounded-xl overflow-hidden bg-white">
      <div className="bg-white/80 border-b border-[var(--dc-gray)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12 gap-6">
            {/* Logo placeholder */}
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-emerald-600" />
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                Dimond Castle
              </span>
            </div>

            {/* Desktop nav preview */}
            <nav className="hidden md:block overflow-visible">
              <ul className="flex items-center gap-4 overflow-x-auto overflow-y-visible whitespace-nowrap no-scrollbar py-1">
                {items.map((item, idx) => (
                  <li key={`${item.href}-${idx}`} className="relative group">
                    <span className="relative group px-3 py-1.5 text-[13px] font-medium text-[var(--dc-text)] transition-all duration-300 border-b-2 border-transparent rounded-md hover:bg-accent/30 hover:shadow-sm hover:-translate-y-0.5 hover:underline underline-offset-4 decoration-[var(--gold-500)] after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--gold-500)] after:rounded-full group-hover:after:w-3/4 after:transition-all after:duration-300">
                      {item.labelEN || "(no EN label)"}
                    </span>
                    {item.children && item.children.length > 0 && (
                      <div className="invisible group-hover:visible absolute left-0 top-full mt-2 min-w-[200px] rounded-md border border-[var(--dc-gray)] bg-white shadow-lg p-2 z-10">
                        <ul className="flex flex-col gap-1">
                          {item.children.map((child, cidx) => (
                            <li key={`${child.href}-${idx}-${cidx}`}>
                              <span className="block px-3 py-1.5 text-[13px] font-medium text-[var(--dc-text)] rounded-md hover:bg-accent/30 hover:underline underline-offset-4">
                                {child.labelEN || "(no EN label)"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavTreeList({
  items,
  depth = 0,
}: {
  items: NavTreeItem[];
  depth?: number;
}) {
  return (
    <ul
      className={`space-y-2 ${
        depth > 0 ? "mt-2 border-l border-gray-200 pl-4" : ""
      }`}
    >
      {items.map((item, index) => (
        <li key={`${item.href}-${index}`} className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {item.labelEN || "(no EN label)"}
              </span>
              <span className="text-xs text-gray-500">
                {item.labelAR || "(no AR label)"}
              </span>
              <span className="mt-1 text-xs text-emerald-700 break-all">
                {item.href}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 border ${
                  item.visible === false
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {item.visible === false ? "Hidden" : "Visible"}
              </span>
              {item.newTab && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 border border-blue-200 bg-blue-50 text-blue-700">
                  Opens in new tab
                </span>
              )}
            </div>
          </div>

          {item.children && item.children.length > 0 && (
            <NavTreeList items={item.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

