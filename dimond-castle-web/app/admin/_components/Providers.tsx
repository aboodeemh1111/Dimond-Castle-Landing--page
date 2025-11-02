"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import React from "react";

let qc: QueryClient | null = null;
function getClient() {
  if (!qc) qc = new QueryClient();
  return qc;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getClient()}>
      {children}
      <Toaster richColors />
    </QueryClientProvider>
  );
}

