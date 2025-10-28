"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Topbar() {
  const pathname = usePathname();

  // Determine page title based on current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/blogs")) return "Blogs";
    if (pathname.startsWith("/media")) return "Media Library";
    return "Admin";
  };

  // Show "New Blog" button on blogs page
  const showNewBlogButton = pathname === "/blogs";

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-admin-border px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-admin-text">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center space-x-4">
        {showNewBlogButton && (
          <Link href="/blogs/new">
            <Button size="md">
              <Plus className="w-4 h-4 mr-2" />
              New Blog
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
