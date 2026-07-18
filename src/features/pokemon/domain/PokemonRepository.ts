import type { PokemonDetail, PokemonPage } from './entities';

/**
 * Contrato del repositorio (Dependency Inversion Principle).
 * Los hooks/casos de uso dependen de esta interfaz, no de la
 * implementación HTTP concreta — lo que permite mockearla en tests
 * o sustituir PokeAPI por otra fuente sin tocar la UI.
 */
export interface PokemonRepository {
  getPage(offset: number, limit: number): Promise<PokemonPage>;
  getDetail(idOrName: number | string): Promise<PokemonDetail>;
}
