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
        This reflects the current navbar configuration used on the public
        website.
      </p>

      <div className="rounded-2xl bg-white shadow-sm p-5 text-sm text-gray-700">
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

        {!loading && !error && data && data.items.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
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

