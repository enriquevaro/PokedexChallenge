import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PokemonCard } from "@/features/pokemon/components/PokemonCard";
import type { PokemonListItem } from "@/features/pokemon/domain/entities";
import { palette } from "@/shared/theme/colors";
import { useFavorites } from "@/features/pokemon/favorites/FavoritesContext";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();

  return(
      <View style={styles.container}>
          <View style={[styles.header, { paddingTop: insets.top + 8}]}>
              <Pressable
                  onPress={() => router.back()}
                  hitSlop={12}
                  accessibilityRole={"button"}
                  accessibilityLabel={"Volver"}
              >
                  <Ionicons
                      name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
                      size={28}
                      color={palette.textPrimary}
                  />
              </Pressable>
              <Text style={styles.tittle}>Favoritos</Text>
          </View>
          {favorites.length === 0 ? (
              <View style={styles.empty}>
                  <Ionicons name='heart-outline' size={48} color={palette.textSecondary}/>
                  <Text style={styles.emptyText}>Aún no tienes Pokémon favoritos.</Text>
              </View>
          ) : (
              <FlashList<PokemonListItem>
                  data={favorites}
                  numColumns={2}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({item}) => <PokemonCard pokemon={item} />}
                  contentContainerStyle={styles.content}
              />
          )}
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        backgroundColor: palette.textDark,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    tittle: {
        color: palette.textPrimary,
        fontSize: 24,
        fontWeight: "800",
    },
    content: {
        padding: 8,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingHorizontal: 24,
    },
    emptyText: {
        color: palette.textSecondary,
        fontSize: 16,
        textAlign: "center",
    },
});