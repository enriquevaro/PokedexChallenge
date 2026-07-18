import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { queryClient } from '@/shared/lib/queryClient';
import { restorePokemonList, setupPokemonListAutoSave } from '@/shared/lib/queryPersistence';
import { palette } from '@/shared/theme/colors';
import { PokemonRepositoryProvider } from '@/features/pokemon/di/PokemonRepositoryContext';
import { pokemonRepository } from '@/features/pokemon/data/pokemonRepositoryImpl';

export default function RootLayout() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    // Restore persisted first page, then start auto-save of the first page
    restorePokemonList(queryClient).then(() => {
      cleanup = setupPokemonListAutoSave(queryClient);
    });
    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PokemonRepositoryProvider repo={pokemonRepository}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.background },
            animation: 'slide_from_right',
          }}
        />
      </PokemonRepositoryProvider>
    </QueryClientProvider>
  );
}
