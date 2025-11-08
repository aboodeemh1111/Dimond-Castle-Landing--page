"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronsLeft } from "lucide-react";
import { adminNav, adminFooter } from "@/config/admin-nav";
import { useAdminI18n } from "@/components/providers/AdminI18nProvider";

type SidebarProps = {
  className?: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onLogout?: () => void;
};

export function Sidebar({ className, collapsed, onToggleCollapsed, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { locale, t } = useAdminI18n();

  const isActive = (href: string) => pathname.startsWith(href);
  const labelFor = (en: string, ar: string) => (locale === "ar" ? ar : en);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-emerald-950 text-emerald-50 border-r border-emerald-900/50",
        collapsed ? "w-16" : "w-64",
        className
      )}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-3 sticky top-0 z-10 bg-emerald-950/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-950/80">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded bg-emerald-800 text-white">DC</div>
          {!collapsed && <span className="font-semibold">Dimond Castle</span>}
        </div>
        <Button
          aria-label={collapsed ? t("aria.expandSidebar") : t("aria.collapseSidebar")}
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          className="text-emerald-50/80 hover:text-white hover:bg-white/10"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Nav */}
      <TooltipProvider disableHoverableContent>
        <ScrollArea className="flex-1 px-2">
          <nav className="flex flex-col gap-1 py-2">
            {adminNav.map((item) => {
              const active = isActive(item.href);
              const label = labelFor(item.label.en, item.label.ar);
              const Icon = item.icon;
              const button = (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-sm text-emerald-50/90 hover:bg-white/10 focus-visible:ring-emerald-400",
                    collapsed ? "px-2" : "px-3",
                    active && "bg-white/15 text-white hover:bg-white/20 border-l-2 border-[#D4AF37]"
                  )}
                >
                  <Link href={item.href} aria-label={label}>
                    <Icon className="h-4 w-4" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                </Button>
              );

              return collapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side={locale === "ar" ? "left" : "right"}>{label}</TooltipContent>
                </Tooltip>
              ) : (
                button
              );
            })}
          </nav>
        </ScrollArea>
      </TooltipProvider>

      <Separator className="mt-auto bg-emerald-900/50" />

      {/* Footer */}
      <div className="p-3 sticky bottom-0 bg-emerald-950">
        {adminFooter.map((item, idx) => {
          const label = labelFor(item.label.en, item.label.ar);
          const Icon = "icon" in item ? (item.icon as any) : undefined;
          const baseClasses = "w-full justify-start gap-3 text-sm text-emerald-50/90 hover:bg-white/10 focus-visible:ring-emerald-400";

          if ("action" in item && item.action === "logout") {
            return (
              <Button
                key={`logout-${idx}`}
                variant="ghost"
                className={cn(baseClasses, "mt-1 hover:text-white hover:bg-red-500/20 text-red-200")}
                onClick={onLogout}
                aria-label={label}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {!collapsed && <span>{label}</span>}
              </Button>
            );
          }

          if ("href" in item) {
            return (
              <Button key={`footer-${idx}`} asChild variant="ghost" className={cn(baseClasses, "mb-1")}> 
                <Link href={item.href} target={item.external ? "_blank" : undefined} aria-label={label}>
                  {Icon && <Icon className="h-4 w-4" />}
                  {!collapsed && <span>{label}</span>}
                </Link>
              </Button>
            );
          }

          return null;
        })}
      </div>
    </aside>
  );
}



