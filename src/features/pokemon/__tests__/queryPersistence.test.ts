import { QueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { restorePokemonList, setupPokemonListAutoSave } from '@/shared/lib/queryPersistence';
import { pokemonKeys, PAGE_SIZE } from '@/features/pokemon/hooks/usePokemonList';

// Jest test helpers
declare var global: any;

jest.mock('expo-secure-store');

describe('queryPersistence', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('restorePokemonList restores data to the QueryClient', async () => {
    const mockQueryClient = { setQueryData: jest.fn() } as unknown as QueryClient;

    const stored = { items: [{ id: 1, name: 'bulbasaur' }], nextOffset: 20 };
    (SecureStore.getItemAsync as unknown as jest.Mock).mockResolvedValue(JSON.stringify(stored));

    await restorePokemonList(mockQueryClient);

    expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
      pokemonKeys.list(),
      { pages: [{ items: stored.items, nextOffset: 20 }], pageParams: [0] },
    );
  });

  test('setupPokemonListAutoSave persists only the first PAGE_SIZE items', async () => {
    const mockItems = Array.from({ length: PAGE_SIZE + 5 }).map((_, i) => ({ id: i + 1, name: `p${i + 1}` }));
    const mockQueryClient: any = {
      getQueryData: jest.fn().mockReturnValue({ pages: [{ items: mockItems, nextOffset: PAGE_SIZE + 5 }] }),
    };

    const setItemMock = (SecureStore.setItemAsync as unknown as jest.Mock).mockResolvedValue(undefined);

    // Replace setInterval so the callback runs immediately
    const originalSetInterval = global.setInterval;
    // @ts-ignore assign
    global.setInterval = (cb: any) => {
      cb();
      return 123 as unknown as any;
    };

    const cleanup = setupPokemonListAutoSave(mockQueryClient as QueryClient);

    // Allow microtasks to run
    await Promise.resolve();

    expect(setItemMock).toHaveBeenCalled();

    const [keyArg, payloadArg] = setItemMock.mock.calls[0];
    const payload = JSON.parse(payloadArg as string);
    expect(payload.items.length).toBe(PAGE_SIZE);

    cleanup();
    // restore
    global.setInterval = originalSetInterval;
  });
});
