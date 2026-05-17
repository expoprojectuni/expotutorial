import {
  crearAnimeApi,
  crearCategoriaApi,
  eliminarAnimeApi,
  eliminarCategoriaApi,
  listarCategorias,
} from "@/services/categoriesApi";
import { guardar, leer, STORAGE_KEYS } from "@/services/storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export interface AnimeItem {
  id: string;
  categoriaId: string;
  titulo: string;
  descripcion: string;
  genero: string;
  episodios: string;
  estudio: string;
  estado: string;
  imagenes: string[];
  notas: string;
  createdAt: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  animes: AnimeItem[];
  createdAt: number;
}

interface CategoriesContextType {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
  crearCategoria: (data: { nombre: string; descripcion: string }) => Promise<Categoria>;
  eliminarCategoria: (categoriaId: string) => Promise<void>;
  obtenerCategoria: (categoriaId: string) => Categoria | undefined;
  agregarAnime: (
    categoriaId: string,
    data: Omit<AnimeItem, "id" | "categoriaId" | "createdAt">
  ) => Promise<AnimeItem>;
  eliminarAnime: (categoriaId: string, animeId: string) => Promise<void>;
  obtenerAnime: (categoriaId: string, animeId: string) => AnimeItem | undefined;
}

const noProvider = async () => {
  throw new Error("CategoriesProvider no inicializado");
};

const CategoriesContext = createContext<CategoriesContextType>({
  categorias: [],
  loading: false,
  error: null,
  refrescar: noProvider,
  crearCategoria: noProvider as never,
  eliminarCategoria: noProvider,
  obtenerCategoria: () => undefined,
  agregarAnime: noProvider as never,
  eliminarAnime: noProvider,
  obtenerAnime: () => undefined,
});

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refrescar = useCallback(async () => {
    if (!userId) {
      setCategorias([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listarCategorias(userId);
      setCategorias(data);
      guardar(STORAGE_KEYS.categorias(userId), data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error al cargar categorías";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setCategorias([]);
      return;
    }
    let cancelado = false;
    (async () => {
      const cache = await leer<Categoria[]>(STORAGE_KEYS.categorias(userId));
      if (!cancelado && cache && cache.length > 0) {
        setCategorias(cache);
      }
      if (!cancelado) refrescar();
    })();
    return () => {
      cancelado = true;
    };
  }, [userId, refrescar]);

  const value = useMemo<CategoriesContextType>(
    () => ({
      categorias,
      loading,
      error,
      refrescar,
      obtenerCategoria: (id) => categorias.find((c) => c.id === id),
      obtenerAnime: (catId, animeId) =>
        categorias.find((c) => c.id === catId)?.animes.find((a) => a.id === animeId),

      crearCategoria: async ({ nombre, descripcion }) => {
        if (!userId) throw new Error("usuario no autenticado");
        const nueva = await crearCategoriaApi({
          user_id: userId,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
        });
        await refrescar();
        return nueva;
      },

      eliminarCategoria: async (id) => {
        const backup = categorias;
        setCategorias((prev) => prev.filter((c) => c.id !== id));
        try {
          await eliminarCategoriaApi(id);
          await refrescar();
        } catch (e) {
          setCategorias(backup);
          throw e;
        }
      },

      agregarAnime: async (categoriaId, data) => {
        const nuevo = await crearAnimeApi(categoriaId, {
          titulo: data.titulo.trim(),
          descripcion: data.descripcion.trim(),
          genero: data.genero.trim(),
          episodios: data.episodios.trim(),
          estudio: data.estudio.trim(),
          estado: data.estado.trim(),
          notas: data.notas.trim(),
          imagenes: data.imagenes.map((u) => u.trim()).filter((u) => u.length > 0),
        });
        await refrescar();
        return nuevo;
      },

      eliminarAnime: async (categoriaId, animeId) => {
        const backup = categorias;
        setCategorias((prev) =>
          prev.map((c) =>
            c.id === categoriaId
              ? { ...c, animes: c.animes.filter((a) => a.id !== animeId) }
              : c
          )
        );
        try {
          await eliminarAnimeApi(animeId);
          await refrescar();
        } catch (e) {
          setCategorias(backup);
          throw e;
        }
      },
    }),
    [categorias, loading, error, userId, refrescar]
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  return useContext(CategoriesContext);
}
