const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders(), ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  get: <T = any>(path: string) => request(path) as Promise<T>,
  post: <T = any>(path: string, body: any) => request(path, { method: "POST", body: JSON.stringify(body) }) as Promise<T>,
  put: <T = any>(path: string, body: any) => request(path, { method: "PUT", body: JSON.stringify(body) }) as Promise<T>,
  delete: <T = any>(path: string) => request(path, { method: "DELETE" }) as Promise<T>,
};

export const API_BASE_URL = API_BASE;


