import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokemonRepositoryProvider } from '../di/PokemonRepositoryContext';
import { usePokemonList } from '../hooks/usePokemonList';

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });

test('usePokemonList uses repository from context', async () => {
  const mockRepo = {
    getPage: jest.fn().mockResolvedValue({ items: [{ id: 1, name: 'bulbasaur', imageUrl: '' }], nextOffset: null }),
    getDetail: jest.fn(),
  };

  function TestComp() {
    const { items } = usePokemonList();
    return <Text testID="count">{String(items.length)}</Text>;
  }

  const queryClient = createQueryClient();

  const rendered = await render(
    <QueryClientProvider client={queryClient}>
      <PokemonRepositoryProvider repo={mockRepo as any}>
        <TestComp />
      </PokemonRepositoryProvider>
    </QueryClientProvider>,
  );

  await waitFor(() => {
    expect(mockRepo.getPage).toHaveBeenCalled();
    expect(rendered.getByTestId('count').props.children).toBe('1');
  });
});
