import React, { createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import type { PokemonListItem} from "@/features/pokemon/domain/entities";
import { loadFavorites, saveFavorites } from './favoritesStorage';

interface FavoritesContextValue {
    favorites: PokemonListItem[];
    isFavorite: (id: number) => boolean;
    toggleFavorite: (pokemon: PokemonListItem) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children} : {children: React.ReactNode}) {
    const [favorites, setFavorites] = useState<PokemonListItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        let mounted = true;
        loadFavorites().then((stored) => {
            if (!mounted) return;
            setFavorites(stored);
            setHydrated(true);
        });

        return () => {
            mounted =false;
        };
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        saveFavorites(favorites);
    }, [favorites, hydrated]);

    const isFavorite = useCallback(
        (id: number) => favorites.some(pokemon => pokemon.id === id),
        [favorites],
    );

    const toggleFavorite = useCallback((pokemon: PokemonListItem) => {
        setFavorites((prevFavorites) => {
            const exists = prevFavorites.some(p => p.id === pokemon.id);
            if (exists) return prevFavorites.filter((p) => p.id !== pokemon.id);
            return [...prevFavorites, pokemon];
        });
    }, []);

    const value = useMemo(() => ({
        favorites,
        isFavorite,
        toggleFavorite,
    }), [favorites, isFavorite, toggleFavorite]);

    return (<FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>);
}

export function useFavorites(): FavoritesContextValue {
    const ctx = useContext(FavoritesContext);
    if (!ctx) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return ctx;
}
