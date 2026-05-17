import { createContext, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export interface Personaje {
  id: number;
  nombre: string;
  descripcion: string;
  habilidades: string;
  anime: string;
  imagenes: string[];
}

type AnimeKey = "saint-seiya" | "hunter-x-hunter" | "one-piece";

type PersonajesPorAnime = Record<AnimeKey, Personaje[]>;

const EMPTY: PersonajesPorAnime = {
  "saint-seiya": [],
  "hunter-x-hunter": [],
  "one-piece": [],
};

interface AnimeContextType {
  personajes: PersonajesPorAnime;
  agregarPersonaje: (anime: string, personaje: Personaje) => void;
  eliminarPersonaje: (anime: string, personajeId: number) => void;
}

const AnimeContext = createContext<AnimeContextType>({
  personajes: EMPTY,
  agregarPersonaje: () => {},
  eliminarPersonaje: () => {},
});

export function AnimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [porUsuario, setPorUsuario] = useState<Record<string, PersonajesPorAnime>>({});

  const userId = user?.id ?? "__anon__";
  const personajes = porUsuario[userId] ?? EMPTY;

  const value = useMemo<AnimeContextType>(
    () => ({
      personajes,
      agregarPersonaje: (anime, personaje) => {
        setPorUsuario((prev) => {
          const actual = prev[userId] ?? EMPTY;
          const key = anime as AnimeKey;
          const listaPrevia = actual[key] ?? [];
          const sinDuplicado = listaPrevia.filter((p) => p.id !== personaje.id);
          return {
            ...prev,
            [userId]: { ...actual, [key]: [...sinDuplicado, personaje] },
          };
        });
      },
      eliminarPersonaje: (anime, personajeId) => {
        setPorUsuario((prev) => {
          const actual = prev[userId] ?? EMPTY;
          const key = anime as AnimeKey;
          const listaPrevia = actual[key] ?? [];
          return {
            ...prev,
            [userId]: {
              ...actual,
              [key]: listaPrevia.filter((p) => p.id !== personajeId),
            },
          };
        });
      },
    }),
    [personajes, userId]
  );

  return <AnimeContext.Provider value={value}>{children}</AnimeContext.Provider>;
}

export function useAnime() {
  return useContext(AnimeContext);
}
