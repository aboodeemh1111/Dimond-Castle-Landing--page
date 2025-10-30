import Navbar from "./Navbar";
import { apiGet, PublicNavItem } from "../lib/api";

export default async function NavbarServer() {
  try {
    const response = await apiGet<PublicNavItem[]>("/public/nav");
    const items = response
      .filter((i) => i.visible !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((i) => ({ key: i.label, href: i.href }));

    if (items.length > 0) {
      return <Navbar items={items} />;
    }
  } catch (_) {
    // ignore and fall back to defaults
  }
  // When API is unavailable or empty, render Navbar with default items
  return <Navbar />;
}
