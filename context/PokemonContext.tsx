import { createContext, useContext, useState } from "react";

const PokemonContext = createContext<any>({
  pokemon: null,
  setPokemon: () => {},
});

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const [pokemon, setPokemon] = useState<any>(null);
  return (
    <PokemonContext.Provider value={{ pokemon, setPokemon }}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  return useContext(PokemonContext);
}
