"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Locale = "en" | "ar";

interface AdminI18nContextType {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const AdminI18nContext = createContext<AdminI18nContextType | null>(null);

const messages = {
  en: {
    // Common actions
    "actions.save": "Save",
    "actions.add": "Add",
    "actions.edit": "Edit",
    "actions.delete": "Delete",
    "actions.cancel": "Cancel",
    "actions.close": "Close",
    "actions.continue": "Continue",
    "actions.search": "Search",
    "actions.filter": "Filter",
    "actions.refresh": "Refresh",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.products": "Products",
    "nav.blogs": "Blogs",
    "nav.pages": "Pages",
    "nav.navigation": "Navigation",
    "nav.media": "Media",
    "nav.theme": "Theme",
    "nav.settings": "Settings",
    "nav.contact": "Contacts",
    "nav.logout": "Logout",
    "nav.menu": "Menu",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview, quick actions and recent activity",
    "dashboard.newBlog": "New Blog Post",
    "dashboard.newPage": "New Page",
    "dashboard.uploadMedia": "Upload Media",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.drafts": "Drafts",
    "dashboard.blogDrafts": "Blog posts",
    "dashboard.pageDrafts": "Pages",
    "dashboard.noDrafts": "No drafts",
    "dashboard.messagesOverview": "Messages Overview",
    "dashboard.systemHealth": "System Health",
    "dashboard.lastThemeUpdate": "Last theme update",

    // Navigation page
    "navigation.title": "Navigation",
    "navigation.subtitle": "Manage the website's menu structure",
    "navigation.addItem": "Add Menu Item",
    "navigation.saveAll": "Save All",
    "navigation.menuStructure": "Menu structure",
    "navigation.itemDetails": "Item details",
    "navigation.rules": "Rules",
    "navigation.validation.labels": "Labels (EN + AR) are required",
    "navigation.validation.link": "Link is required; internal must point to a published page",
    "navigation.validation.depth": "Max nesting depth: 3 levels",
    "navigation.validation.duplicate": "No duplicate links in the same level",

    // Messages page
    "messages.title": "Messages",
    "messages.subtitle": "View and manage contact form submissions",
    "messages.search": "Search messages...",
    "messages.allMessages": "All Messages",
    "messages.unseen": "Unseen",
    "messages.resolved": "Resolved",
    "messages.unresolved": "Unresolved",
    "messages.noMessages": "No messages found",
    "messages.noMessagesDesc": "Messages from the contact form will appear here",

    // Products page
    "products.title": "Products",
    "products.subtitle": "Manage your product catalog and inventory",
    "products.addProduct": "Add Product",
    "products.search": "Search products...",
    "products.allProducts": "All Products",
    "products.published": "Published",
    "products.draft": "Draft",
    "products.noProducts": "No products found",
    "products.getStarted": "Get started by creating your first product",

    // Common status
    "status.published": "Published",
    "status.draft": "Draft",
    "status.inStock": "In Stock",
    "status.outOfStock": "Out of Stock",

    // Language
    "lang.en": "EN",
    "lang.ar": "عر",

    // ARIA labels
    "aria.expandSidebar": "Expand sidebar",
    "aria.collapseSidebar": "Collapse sidebar",
    "aria.openMenu": "Open menu",
    "aria.notifications": "Notifications",
  },
  ar: {
    // Common actions
    "actions.save": "حفظ",
    "actions.add": "إضافة",
    "actions.edit": "تعديل",
    "actions.delete": "حذف",
    "actions.cancel": "إلغاء",
    "actions.close": "إغلاق",
    "actions.continue": "متابعة",
    "actions.search": "بحث",
    "actions.filter": "تصفية",
    "actions.refresh": "تحديث",

    // Navigation
    "nav.dashboard": "لوحة التحكم",
    "nav.products": "المنتجات",
    "nav.blogs": "المدونة",
    "nav.pages": "الصفحات",
    "nav.navigation": "القائمة",
    "nav.media": "الوسائط",
    "nav.theme": "السمة",
    "nav.settings": "الإعدادات",
    "nav.contact": "الرسائل",
    "nav.logout": "تسجيل الخروج",
    "nav.menu": "القائمة",

    // Dashboard
    "dashboard.title": "لوحة التحكم",
    "dashboard.subtitle": "نظرة عامة والإجراءات السريعة والنشاط الأخير",
    "dashboard.newBlog": "مقال جديد",
    "dashboard.newPage": "صفحة جديدة",
    "dashboard.uploadMedia": "رفع وسائط",
    "dashboard.recentActivity": "النشاط الأخير",
    "dashboard.drafts": "المسودات",
    "dashboard.blogDrafts": "المقالات",
    "dashboard.pageDrafts": "الصفحات",
    "dashboard.noDrafts": "لا توجد مسودات",
    "dashboard.messagesOverview": "نظرة على الرسائل",
    "dashboard.systemHealth": "حالة النظام",
    "dashboard.lastThemeUpdate": "آخر تحديث للسمة",

    // Navigation page
    "navigation.title": "القائمة",
    "navigation.subtitle": "إدارة هيكل قائمة الموقع",
    "navigation.addItem": "إضافة عنصر قائمة",
    "navigation.saveAll": "حفظ الكل",
    "navigation.menuStructure": "هيكل القائمة",
    "navigation.itemDetails": "تفاصيل العنصر",
    "navigation.rules": "القواعد",
    "navigation.validation.labels": "العناوين (EN + AR) مطلوبة",
    "navigation.validation.link": "الرابط مطلوب؛ الداخلي يجب أن يشير إلى صفحة منشورة",
    "navigation.validation.depth": "الحد الأقصى للعمق: 3 مستويات",
    "navigation.validation.duplicate": "لا روابط مكررة في نفس المستوى",

    // Messages page
    "messages.title": "الرسائل الواردة",
    "messages.subtitle": "عرض وإدارة رسائل نموذج الاتصال",
    "messages.search": "البحث في الرسائل...",
    "messages.allMessages": "جميع الرسائل",
    "messages.unseen": "غير مقروءة",
    "messages.resolved": "مُحلّة",
    "messages.unresolved": "غير محلولة",
    "messages.noMessages": "لم يتم العثور على رسائل",
    "messages.noMessagesDesc": "ستظهر رسائل نموذج الاتصال هنا",

    // Products page
    "products.title": "المنتجات",
    "products.subtitle": "إدارة كتالوج المنتجات والمخزون",
    "products.addProduct": "إضافة منتج",
    "products.search": "البحث في المنتجات...",
    "products.allProducts": "جميع المنتجات",
    "products.published": "منشور",
    "products.draft": "مسودة",
    "products.noProducts": "لم يتم العثور على منتجات",
    "products.getStarted": "ابدأ بإنشاء منتجك الأول",

    // Common status
    "status.published": "منشور",
    "status.draft": "مسودة",
    "status.inStock": "متوفر",
    "status.outOfStock": "غير متوفر",

    // Language
    "lang.en": "EN",
    "lang.ar": "عر",

    // ARIA labels
    "aria.expandSidebar": "توسيع الشريط الجانبي",
    "aria.collapseSidebar": "تصغير الشريط الجانبي",
    "aria.openMenu": "فتح القائمة",
    "aria.notifications": "الإشعارات",
  },
};

interface AdminI18nProviderProps {
  children: ReactNode;
}

export function AdminI18nProvider({ children }: AdminI18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("admin-locale") as Locale;
    if (saved && (saved === "en" || saved === "ar")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem("admin-locale", nextLocale);
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  const t = (key: string): string => {
    return (messages[locale] as any)[key] || key;
  };

  const contextValue: AdminI18nContextType = {
    locale,
    dir,
    t,
    setLocale,
  };

  return (
    <AdminI18nContext.Provider value={contextValue}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n(): AdminI18nContextType {
  const context = useContext(AdminI18nContext);
  if (!context) {
    throw new Error("useAdminI18n must be used within AdminI18nProvider");
  }
  return context;
}
