import Navbar from "./Navbar";
import { apiGet, PublicNavItem } from "../lib/api";

export default async function NavbarServer() {
  let items: PublicNavItem[] = [];
  try {
    items = await apiGet<PublicNavItem[]>("/public/nav");
  } catch (_) {
    // fallback to empty; Navbar will render defaults
  }
  return <Navbar items={items.map((i) => ({ key: i.label, href: i.href }))} />;
}
