"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { apiGet } from "../lib/api";

type PublicNavTreeItem = {
  labelEN: string;
  labelAR: string;
  href: string;
  visible?: boolean;
  newTab?: boolean;
  children?: PublicNavTreeItem[];
};

export default function NavbarServer() {
  const [tree, setTree] = useState<PublicNavTreeItem[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await apiGet<{ name: string; items: PublicNavTreeItem[] }>(
          "/api/navigation/public/main"
        );
        const filterVisible = (items: PublicNavTreeItem[]): PublicNavTreeItem[] =>
          items
            .filter((i) => i.visible !== false)
            .map((i) => ({
              ...i,
              children: i.children ? filterVisible(i.children) : [],
            }));
        const filtered = filterVisible(response.items || []);
        if (mounted && filtered.length > 0) setTree(filtered);
      } catch {
        // ignore and fall back to defaults
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // If nav not loaded, Navbar will use its own defaults
  return <Navbar treeItems={tree ?? undefined} />;
}
