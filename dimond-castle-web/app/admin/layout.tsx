import React from "react";
import Providers from "./_components/Providers";
import Protected from "./_components/Protected";
import Sidebar from "./_components/Sidebar";
import Topbar from "./_components/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Protected>
        <div className="flex h-screen bg-cream text-textDark">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Topbar />
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-cream">
              {children}
            </div>
          </main>
        </div>
      </Protected>
    </Providers>
  );
}

