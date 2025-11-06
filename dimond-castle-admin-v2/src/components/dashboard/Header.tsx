"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { adminNav } from "@/config/admin-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header({ locale = "en" }: { locale?: "en" | "ar" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const labelFor = (en: string, ar: string) => (locale === "ar" ? ar : en);
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button aria-label="Open menu" variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="px-4 py-3">
              <SheetTitle>{labelFor("Menu", "القائمة")}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-2 pb-4">
              {adminNav.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const label = labelFor(item.label.en, item.label.ar);
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-sm",
                      active && "bg-muted"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <span className="text-sm text-muted-foreground">Dashboard</span>
      </div>
      <div className="flex items-center gap-2">
        <Button aria-label="Notifications" variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>DC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}


