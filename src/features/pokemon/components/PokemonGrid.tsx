import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { palette } from '@/shared/theme/colors';
import type { PokemonListItem } from '../domain/entities';
import type { UsePokemonListResult } from '../hooks/usePokemonList';
import { PokemonCard } from './PokemonCard';

/** Props passed from parent that owns the hook to allow header progress bar control. */
export function PokemonGrid({
  items,
  isLoading,
  isError,
  refetch,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UsePokemonListResult) {
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="loading-center" size="large" color={palette.header} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se pudo cargar la lista.</Text>
        <Text style={styles.retry} onPress={() => refetch()}>
          Reintentar
        </Text>
      </View>
    );
  }

  return (
    <FlashList<PokemonListItem>
      data={items}
      numColumns={2}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PokemonCard pokemon={item} />}
      contentContainerStyle={styles.content}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator testID="loading-footer" style={styles.footer} color={palette.header} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  error: {
    color: palette.textDark,
    fontSize: 16,
  },
  retry: {
    color: palette.header,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginVertical: 16,
  },
});
