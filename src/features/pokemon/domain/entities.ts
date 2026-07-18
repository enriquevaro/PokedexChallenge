/**
 * Entidades del dominio. Sin dependencias externas:
 * no conocen la API, ni React, ni librerías de terceros.
 */

export interface PokemonListItem {
  id: number;
  name: string;
  imageUrl: string;
}

export interface PokemonPage {
  items: PokemonListItem[];
  /** Offset de la siguiente página, o null si no hay más. */
  nextOffset: number | null;
}

export type StatKey = 'hp' | 'atk' | 'def' | 'spd' | 'exp';

export interface PokemonStat {
  key: StatKey;
  label: string;
  value: number;
  max: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  weightKg: number;
  heightM: number;
  stats: PokemonStat[];
}
