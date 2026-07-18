import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PokemonGrid } from '@/features/pokemon/components/PokemonGrid';
import { palette } from '@/shared/theme/colors';

/** Pantalla de lista: solo compone; la lógica vive en el feature. */
export default function ListScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Pokédex</Text>
      </View>
      <PokemonGrid />
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
