"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const locale: "en" | "ar" = "en";

  return (
    <div className={cn("min-h-screen bg-background", collapsed ? "md:pl-16" : "md:pl-64")}> 
      <Sidebar
        className="fixed inset-y-0 left-0 z-40 hidden md:flex"
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        locale={locale}
      />
      <div className="flex w-full flex-col">
        <Header locale={locale} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}


