"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { AdminI18nProvider, useAdminI18n } from "@/components/providers/AdminI18nProvider";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { dir } = useAdminI18n();

  return (
    <div
      dir={dir}
      className={cn("min-h-screen bg-background", collapsed ? "md:pl-16" : "md:pl-64")}
    >
      <Sidebar
        className="fixed inset-y-0 left-0 z-40 hidden md:flex"
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />
      <div className="flex w-full flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminI18nProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AdminI18nProvider>
  );
}


