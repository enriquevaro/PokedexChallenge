import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { palette } from '@/shared/theme/colors';
import type { PokemonListItem } from '../domain/entities';
import { usePokemonList } from '../hooks/usePokemonList';
import { PokemonCard } from './PokemonCard';

/** Grilla de 2 columnas con scroll infinito (páginas de 20). */
export function PokemonGrid() {
  const { items, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonList();

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={palette.header} />
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
          <ActivityIndicator style={styles.footer} color={palette.header} />
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
