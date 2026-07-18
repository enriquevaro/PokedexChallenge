import React, { createContext, useContext } from 'react';
import type { PokemonRepository } from '../domain/PokemonRepository';

const PokemonRepositoryContext = createContext<PokemonRepository | null>(null);

export function PokemonRepositoryProvider({
  repo,
  children,
}: {
  repo: PokemonRepository;
  children: React.ReactNode;
}) {
  return (
    <PokemonRepositoryContext.Provider value={repo}>
      {children}
    </PokemonRepositoryContext.Provider>
  );
}

export function usePokemonRepositoryFromContext(): PokemonRepository | null {
  return useContext(PokemonRepositoryContext);
}
