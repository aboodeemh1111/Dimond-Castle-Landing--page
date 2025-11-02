"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Files,
  PanelsTopLeft,
  Image as ImageIcon,
  Palette,
  Settings,
  Mail,
  LogOut,
} from "lucide-react";
import { useAuth } from "../stores/auth";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/pages", label: "Pages", icon: Files },
  { href: "/admin/navigation", label: "Navigation", icon: PanelsTopLeft },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/theme", label: "Theme", icon: Palette },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { clear } = useAuth();

  return (
    <aside className="w-64 bg-brand-green-600 text-white hidden md:flex md:flex-col">
      <div className="px-4 py-5 text-lg font-semibold tracking-wide">Dimond Castle</div>
      <nav className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                active ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          clear();
          window.location.href = "/login";
        }}
        className="m-3 flex items-center gap-3 rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20 transition"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}

