const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    cache: "force-cache",
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export type PublicNavItem = {
  label: string;
  href: string;
  order: number;
  visible: boolean;
};
