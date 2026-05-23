import type { AnimeItem, Categoria } from "@/context/CategoriesContext";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://new-back-animes.onrender.com/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("no se pudo conectar al servidor", 0);
  }

  if (res.status === 204) return undefined as T;

  const data = (await res.json().catch(() => null)) as { error?: string } | T | null;

  if (!res.ok) {
    const fallback =
      res.status === 413
        ? "las imágenes son muy pesadas, intenta con menos o más livianas"
        : `error ${res.status}`;
    const msg = (data as { error?: string } | null)?.error ?? fallback;
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

export function listarCategorias(userId: string): Promise<Categoria[]> {
  return request(`/categorias?user_id=${encodeURIComponent(userId)}`);
}

export function crearCategoriaApi(payload: {
  user_id: string;
  nombre: string;
  descripcion: string;
}): Promise<Categoria> {
  return request(`/categorias`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function eliminarCategoriaApi(id: string): Promise<void> {
  return request(`/categorias/${id}`, { method: "DELETE" });
}

export function crearAnimeApi(
  categoriaId: string,
  payload: Omit<AnimeItem, "id" | "categoriaId" | "createdAt">
): Promise<AnimeItem> {
  return request(`/categorias/${categoriaId}/animes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function eliminarAnimeApi(id: string): Promise<void> {
  return request(`/animes/${id}`, { method: "DELETE" });
}
