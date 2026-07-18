import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { PokemonGrid } from '../components/PokemonGrid';

// Mock the card to avoid network/hooks
jest.mock('../components/PokemonCard', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    PokemonCard: ({ pokemon }: any) => React.createElement(RN.Text, { testID: `card-${pokemon.id}` }, pokemon.name),
  };
});

test('PokemonGrid renders items and footer loader', async () => {
  const props: any = {
    items: [{ id: 1, name: 'bulbasaur' }, { id: 2, name: 'ivysaur' }],
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
    fetchNextPage: jest.fn(),
    hasNextPage: true,
    isFetchingNextPage: true,
  };

  const rendered = await render(<PokemonGrid {...props} />);
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });

  expect(rendered.getByTestId('card-1')).toBeTruthy();
  expect(rendered.getByTestId('card-2')).toBeTruthy();
  // now footer skeletons are shown while fetching next page
  const footerSkeletons = rendered.getAllByTestId('skeleton-tile');
  expect(footerSkeletons.length).toBeGreaterThanOrEqual(2);
});

test('PokemonGrid shows center loader when isLoading', async () => {
  const props: any = {
    items: [],
    isLoading: true,
    isError: false,
    refetch: jest.fn(),
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  };

  const rendered = await render(<PokemonGrid {...props} />);
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });

  // should render skeleton tiles when loading
  const tiles = rendered.getAllByTestId('skeleton-tile');
  expect(tiles.length).toBeGreaterThan(0);
});
