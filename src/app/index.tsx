import {Pressable, StyleSheet, Text, View} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PokemonGrid } from '@/features/pokemon/components/PokemonGrid';
import { palette } from '@/shared/theme/colors';
import { usePokemonList } from '@/features/pokemon/hooks/usePokemonList';
import { TopProgressBar } from '@/features/pokemon/components/TopProgressBar';
import {Ionicons} from "@expo/vector-icons";
import { useFavorites } from "@/features/pokemon/favorites/FavoritesContext";
import {router} from "expo-router";

/** Pantalla de lista: ahora posee la lógica de la lista para controlar la barra de progreso en el header. */
export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const listState = usePokemonList();
  const loading = listState.isLoading || listState.isFetchingNextPage;
  const { favorites } = useFavorites();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Pokédex</Text>
          <Pressable
              onPress={() => router.push('/favorites') }
              hitSlop={12}
              style={styles.favoritesButton}
              accessibilityRole={"button"}
              accessibilityLabel={`Ver favoritos`}
          >
            <Ionicons name="heart" size={32} color={ palette.textPrimary } />
            {favorites.length > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
        <TopProgressBar visible={loading} />
      </View>
      <PokemonGrid {...listState} />
    </View>
  );
}

const showToastWithGravity = () => {
  console.log('showToastWithGravity');
};

const styles = StyleSheet.create({
  content:{
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    backgroundColor: palette.textDark,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: '800'
  },
  title: {
    color: palette.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 12,
  },
  favoritesButton: {
    position: "relative",
    paddingTop: 24,
  },
  badge: {
    position: "absolute",
    top: 18,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: palette.header,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: palette.textPrimary,
    fontSize: 11,
    fontWeight: "700"
  },
});
