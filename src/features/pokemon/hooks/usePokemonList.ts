import { useInfiniteQuery } from '@tanstack/react-query';
import type { PokemonListItem } from '../domain/entities';
import type { PokemonRepository } from '../domain/PokemonRepository';
import { pokemonRepository as defaultPokemonRepository } from '../data/pokemonRepositoryImpl';

export const PAGE_SIZE = 20;

export const pokemonKeys = {
  all: ['pokemon'] as const,
  list: () => [...pokemonKeys.all, 'list'] as const,
  detail: (idOrName: number | string) =>
    [...pokemonKeys.all, 'detail', String(idOrName)] as const,
};

/**
 * Caso de uso: listar pokémon con paginación infinita de 20 en 20.
 * TanStack Query gestiona caché, reintentos y estados de carga.
 */
export function usePokemonList(repo: PokemonRepository = defaultPokemonRepository) {
  const query = useInfiniteQuery({
    queryKey: pokemonKeys.list(),
    queryFn: ({ pageParam }) => repo.getPage(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });

  const items: PokemonListItem[] =
    query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, items };
}
