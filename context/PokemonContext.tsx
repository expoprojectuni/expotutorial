import { createContext, useContext, useState } from "react";

const PokemonContext = createContext<any>({
  pokemon: null,
  setPokemon: () => {},
  cantidadImagenes: 0,
  setCantidadImagenes: () => {},
});

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const [pokemon, setPokemon] = useState<any>(null);
  const [cantidadImagenes, setCantidadImagenes] = useState(0);
  return (
    <PokemonContext.Provider value={{ pokemon, setPokemon, cantidadImagenes, setCantidadImagenes }}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  return useContext(PokemonContext);
}
