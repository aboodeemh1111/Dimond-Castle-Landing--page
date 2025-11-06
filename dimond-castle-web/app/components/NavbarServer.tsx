"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { apiGet, PublicNavItem } from "../lib/api";

type NavItem = { key: string; href: string };

export default function NavbarServer() {
  const [items, setItems] = useState<NavItem[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await apiGet<PublicNavItem[]>("/public/nav");
        const mapped = response
          .filter((i) => i.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((i) => ({ key: i.label, href: i.href }));
        if (mounted && mapped.length > 0) setItems(mapped);
      } catch {
        // ignore and fall back to defaults
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // If items are not loaded or empty, Navbar will use its own defaults
  return <Navbar items={items ?? undefined} />;
}
