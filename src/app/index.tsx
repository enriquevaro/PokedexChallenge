import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PokemonGrid } from '@/features/pokemon/components/PokemonGrid';
import { palette } from '@/shared/theme/colors';
import { usePokemonList } from '@/features/pokemon/hooks/usePokemonList';
import { TopProgressBar } from '@/features/pokemon/components/TopProgressBar';

/** Pantalla de lista: ahora posee la lógica de la lista para controlar la barra de progreso en el header. */
export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const listState = usePokemonList();
  const loading = listState.isLoading || listState.isFetchingNextPage;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Pokédex</Text>
        <TopProgressBar visible={loading} />
      </View>
      <PokemonGrid {...listState} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    backgroundColor: palette.textDark,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 12,
  },
});
