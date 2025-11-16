import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Menu as MenuIcon,
  Image as ImageIcon,
  Palette,
  Settings as SettingsIcon,
  Inbox,
  Mail,
  LogOut,
  ExternalLink,
  Package,
  Truck,
  Sparkles,
  BookOpen,
  Handshake,
} from "lucide-react";

export type AdminNavItem = {
  label: { en: string; ar: string };
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type AdminFooterItem =
  | { label: { en: string; ar: string }; action: "logout"; icon: React.ComponentType<{ className?: string }> }
  | { label: { en: string; ar: string }; href: string; icon: React.ComponentType<{ className?: string }>; external?: boolean };

export const adminNav: AdminNavItem[] = [
  { label: { en: "Dashboard", ar: "لوحة التحكم" }, href: "/admin/dashboard", icon: LayoutDashboard },
  { label: { en: "Products", ar: "المنتجات" }, href: "/admin/products", icon: Package },
  { label: { en: "Blogs", ar: "المدونة" }, href: "/admin/blogs", icon: Newspaper },
  { label: { en: "Pages", ar: "الصفحات" }, href: "/admin/pages", icon: FileText },
  { label: { en: "Navigation", ar: "القائمة" }, href: "/admin/navigation", icon: MenuIcon },
  { label: { en: "Media", ar: "الوسائط" }, href: "/admin/media", icon: ImageIcon },
  { label: { en: "Hero", ar: "قسم البطل" }, href: "/admin/hero", icon: Sparkles },
  { label: { en: "Story", ar: "القصة" }, href: "/admin/story", icon: BookOpen },
  { label: { en: "Vision", ar: "الرؤية" }, href: "/admin/vision", icon: BookOpen },
  { label: { en: "Values", ar: "القيم" }, href: "/admin/values", icon: BookOpen },
  { label: { en: "Clients", ar: "العملاء" }, href: "/admin/clients", icon: Handshake },
  { label: { en: "Services", ar: "الخدمات" }, href: "/admin/services", icon: Truck },
  { label: { en: "Messages", ar: "الرسائل الواردة" }, href: "/admin/messages", icon: Mail },
  { label: { en: "Theme", ar: "السمة" }, href: "/admin/theme", icon: Palette },
  { label: { en: "Settings", ar: "الإعدادات" }, href: "/admin/settings", icon: SettingsIcon },
  { label: { en: "Contacts", ar: "الرسائل" }, href: "/admin/contact", icon: Inbox },
];

export const adminFooter: AdminFooterItem[] = [
  { label: { en: "Preview site", ar: "معاينة الموقع" }, href: "/", icon: ExternalLink, external: true },
  { label: { en: "Logout", ar: "تسجيل الخروج" }, action: "logout", icon: LogOut },
];


