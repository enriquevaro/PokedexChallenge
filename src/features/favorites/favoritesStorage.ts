import * as SecureStore from 'expo-secure-store';
import type { PokemonListItem} from "@/features/pokemon/domain/entities";

const STORAGE_KEY = 'pokedex_favorites_v1';

export async function loadFavorites(): Promise<PokemonListItem[]> {
    try {
        const raw = await SecureStore.getItemAsync(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn(`Failed to load favorites from secure storage: ${e}`);
        return [];
    }
}

export async function saveFavorites(favorites: PokemonListItem[]): Promise<void> {
    try {
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
        console.warn(`Failed to save favorites to secure storage: ${e}`);
    }
}