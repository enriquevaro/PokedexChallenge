import { getJson } from '@/shared/lib/http';
import type { PokemonPage, PokemonDetail } from '../domain/entities';
import type { PokemonRepository } from '../domain/PokemonRepository';
import type { PokemonDetailDto, PokemonListResponseDto } from './dto';
import { toDetail, toListItems } from './mappers';

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Implementación del repositorio contra PokeAPI v2.
 * Cumple SRP: solo sabe pedir datos y delegar el mapeo.
 */
export class PokeApiRepository implements PokemonRepository {
  async getPage(offset: number, limit: number): Promise<PokemonPage> {
    const dto = await getJson<PokemonListResponseDto>(
      `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
    );
    return {
      items: toListItems(dto),
      nextOffset: dto.next ? offset + limit : null,
    };
  }

  async getDetail(idOrName: number | string): Promise<PokemonDetail> {
    const dto = await getJson<PokemonDetailDto>(`${BASE_URL}/pokemon/${idOrName}`);
    return toDetail(dto);
  }
}

/** Instancia única usada por los hooks (punto de composición). */
export const pokemonRepository: PokemonRepository = new PokeApiRepository();
