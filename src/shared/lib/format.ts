export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** 1 → "#001" */
export function pokedexNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}
