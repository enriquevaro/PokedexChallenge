export const palette = {
  background: '#FFFFFF',
  surface: '#2F2E33',
  header: '#CC4B4B',
  textPrimary: '#FFFFFF',
  textDark: '#000000',
  textSecondary: '#9E9DA3',
  trackLight: '#F4F3F0',
} as const;

/** Color de tarjeta/hero según el tipo principal del pokémon. */
export const typeColors: Record<string, string> = {
  normal: '#A5A58C',
  fire: '#EDE3C4',
  water: '#6FA1C4',
  electric: '#E3C55C',
  grass: '#8AB5A0',
  ice: '#8FC8C8',
  fighting: '#C06A5A',
  poison: '#9B7BAB',
  ground: '#C7A46A',
  flying: '#96A6D6',
  psychic: '#D67D99',
  bug: '#A4B25E',
  rock: '#AFA06C',
  ghost: '#7A70A6',
  dragon: '#7A6FD6',
  dark: '#6E6459',
  steel: '#A7A7BE',
  fairy: '#D69AC1',
};

export const fallbackTypeColor = '#5A6E8C';

export function colorForType(type?: string): string {
  return (type && typeColors[type]) || fallbackTypeColor;
}

/** Colores de las barras de estadísticas (según el diseño). */
export const statColors: Record<string, string> = {
  hp: '#E05858',
  atk: '#F0A24F',
  def: '#4A90E2',
  spd: '#9AB6CE',
  exp: '#579E57',
};
