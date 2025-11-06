import { mockGet, mockPost } from "./mocks";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS === "1" ||
  process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export async function apiAuthGet<T>(path: string, token?: string): Promise<T> {
  if (USE_MOCKS) {
    return await mockGet<T>(path);
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export async function apiAuthPost<T>(
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  if (USE_MOCKS) {
    return await mockPost<T>(path, body as any);
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

