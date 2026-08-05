export const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) || "https://casino-demo-py.onrender.com").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type FetchOpts = RequestInit & { token?: string | null };

export async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { token, headers, ...rest } = opts;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión.");
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* algunas respuestas no traen body */
  }
  if (!res.ok) {
    const detail = (data as { detail?: string } | null)?.detail;
    throw new ApiError(res.status, detail || `Error ${res.status}`);
  }
  return data as T;
}

export function newIdempotencyKey(): string {
  if ("randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
