/** Tipos del transporte (DTOs): reflejan la forma exacta de PokeAPI v2. */

export interface PokemonListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface PokemonDetailDto {
  id: number;
  name: string;
  base_experience: number | null;
  /** Hectogramos */
  weight: number;
  /** Decímetros */
  height: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other?: {
      ['official-artwork']?: { front_default: string | null };
    };
  };
}
