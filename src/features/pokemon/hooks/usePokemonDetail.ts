import { useQuery } from '@tanstack/react-query';
import type { PokemonRepository } from '../domain/PokemonRepository';
import { pokemonRepository as defaultPokemonRepository } from '../data/pokemonRepositoryImpl';
import { pokemonKeys } from './usePokemonList';

/** Caso de uso: detalle de un pokémon (también lo usan las tarjetas para el color por tipo). */
export function usePokemonDetail(idOrName: number | string, repo: PokemonRepository = defaultPokemonRepository) {
  return useQuery({
    queryKey: pokemonKeys.detail(idOrName),
    queryFn: () => repo.getDetail(idOrName),
    staleTime: Infinity,
  });
}
