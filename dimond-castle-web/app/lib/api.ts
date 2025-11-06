// Prefer relative API calls in the browser during development (Next.js rewrites will proxy to the API)
const API_BASE = (() => {
  const envBase = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    // In the browser: if no explicit base URL, use relative to leverage dev proxy
    return envBase || "";
  }
  // On the server: fall back to env or localhost
  return envBase || "http://localhost:4000";
})();

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    cache: "no-store", // Disable caching for development
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      message = await res.text();
    } catch {}
    throw new Error(message || `Request failed: ${url}`);
  }
  return (await res.json()) as T;
}

export type PublicNavItem = {
  label: string;
  href: string;
  order: number;
  visible: boolean;
};
