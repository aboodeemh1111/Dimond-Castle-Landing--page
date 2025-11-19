const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function getAuthHeaders() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path: string, init?: RequestInit) {
  const finalHeaders: Record<string, string> = {
    ...getAuthHeaders(),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (!isFormData && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: finalHeaders,
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
  post: <T = any>(path: string, body: any) =>
    request(path, { method: "POST", body: JSON.stringify(body) }) as Promise<T>,
  put: <T = any>(path: string, body: any) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }) as Promise<T>,
  delete: <T = any>(path: string) => request(path, { method: "DELETE" }) as Promise<T>,
  postForm: <T = any>(path: string, form: FormData) =>
    request(path, { method: "POST", body: form }) as Promise<T>,
};

export const API_BASE_URL = API_BASE;


