import type { PokemonDetail, PokemonListItem, PokemonStat } from '../domain/entities';
import type { PokemonDetailDto, PokemonListResponseDto } from './dto';

/**
 * Mappers (patrón Adapter): aíslan el dominio del formato de PokeAPI.
 * Si la API cambia, solo se toca este archivo.
 */

// jsDelivr como CDN principal (mejor disponibilidad que raw.githubusercontent,
// que algunos dispositivos/redes Android bloquean), con fallbacks.
const CDN = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon';
const RAW = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function artworkUrl(id: number): string {
  return `${CDN}/other/official-artwork/${id}.png`;
}

/** Cadena de URLs a intentar en orden si alguna falla. */
export function imageUrlCandidates(id: number): string[] {
  return [
    artworkUrl(id),
    `${RAW}/other/official-artwork/${id}.png`,
    `${CDN}/${id}.png`, // sprite simple como último recurso
  ];
}

/** Extrae el id de una URL tipo https://pokeapi.co/api/v2/pokemon/25/ */
export function idFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  if (!match) throw new Error(`URL de pokemon inválida: ${url}`);
  return Number(match[1]);
}

export function toListItems(dto: PokemonListResponseDto): PokemonListItem[] {
  return dto.results.map((r) => {
    const id = idFromUrl(r.url);
    return { id, name: r.name, imageUrl: artworkUrl(id) };
  });
}

const STAT_MAX = 300;
const EXP_MAX = 1000;

export function toDetail(dto: PokemonDetailDto): PokemonDetail {
  const byName = (name: string) =>
    dto.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

  const stats: PokemonStat[] = [
    { key: 'hp', label: 'HP', value: byName('hp'), max: STAT_MAX },
    { key: 'atk', label: 'ATK', value: byName('attack'), max: STAT_MAX },
    { key: 'def', label: 'DEF', value: byName('defense'), max: STAT_MAX },
    { key: 'spd', label: 'SPD', value: byName('speed'), max: STAT_MAX },
    { key: 'exp', label: 'EXP', value: dto.base_experience ?? 0, max: EXP_MAX },
  ];

  return {
    id: dto.id,
    name: dto.name,
    imageUrl:
      dto.sprites.other?.['official-artwork']?.front_default ?? artworkUrl(dto.id),
    types: [...dto.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    weightKg: dto.weight / 10, // hectogramos → kg
    heightM: dto.height / 10, // decímetros → m
    stats,
  };
}
