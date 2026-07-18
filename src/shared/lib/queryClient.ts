import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // los datos de PokeAPI casi no cambian
      gcTime: 1000 * 60 * 60 * 24,
      retry: 2,
    },
  },
});
