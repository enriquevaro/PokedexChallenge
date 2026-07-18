import { artworkUrl, idFromUrl, toDetail, toListItems } from '../data/mappers';
import type { PokemonDetailDto, PokemonListResponseDto } from '../data/dto';

describe('idFromUrl', () => {
  it('extrae el id de la URL de PokeAPI', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/1')).toBe(1);
  });

  it('lanza error con URLs inválidas', () => {
    expect(() => idFromUrl('https://pokeapi.co/api/v2/type/3/')).toThrow();
  });
});

describe('toListItems', () => {
  it('mapea la respuesta de lista a entidades del dominio', () => {
    const dto: PokemonListResponseDto = {
      count: 1302,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };

    expect(toListItems(dto)).toEqual([
      { id: 1, name: 'bulbasaur', imageUrl: artworkUrl(1) },
    ]);
  });
});

describe('toDetail', () => {
  const dto: PokemonDetailDto = {
    id: 1,
    name: 'bulbasaur',
    base_experience: 64,
    weight: 69, // hectogramos
    height: 7, // decímetros
    types: [
      { slot: 2, type: { name: 'poison' } },
      { slot: 1, type: { name: 'grass' } },
    ],
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
      { base_stat: 49, stat: { name: 'defense' } },
      { base_stat: 45, stat: { name: 'speed' } },
    ],
    sprites: { other: { 'official-artwork': { front_default: null } } },
  };

  it('convierte unidades a kg y metros', () => {
    const detail = toDetail(dto);
    expect(detail.weightKg).toBe(6.9);
    expect(detail.heightM).toBe(0.7);
  });

  it('ordena los tipos por slot', () => {
    expect(toDetail(dto).types).toEqual(['grass', 'poison']);
  });

  it('mapea las estadísticas con sus máximos', () => {
    const stats = toDetail(dto).stats;
    expect(stats).toEqual([
      { key: 'hp', label: 'HP', value: 45, max: 300 },
      { key: 'atk', label: 'ATK', value: 49, max: 300 },
      { key: 'def', label: 'DEF', value: 49, max: 300 },
      { key: 'spd', label: 'SPD', value: 45, max: 300 },
      { key: 'exp', label: 'EXP', value: 64, max: 1000 },
    ]);
  });

  it('usa la URL de artwork como fallback de imagen', () => {
    expect(toDetail(dto).imageUrl).toBe(artworkUrl(1));
  });
});
