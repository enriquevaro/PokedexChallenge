import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '@/shared/lib/queryClient';
import { palette } from '@/shared/theme/colors';
import { PokemonRepositoryProvider } from '@/features/pokemon/di/PokemonRepositoryContext';
import { pokemonRepository } from '@/features/pokemon/data/pokemonRepositoryImpl';

export default function RootLayout() {
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
