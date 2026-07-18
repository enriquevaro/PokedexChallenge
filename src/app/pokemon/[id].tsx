import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PokemonImage } from '@/features/pokemon/components/PokemonImage';
import { StatBar } from '@/features/pokemon/components/StatBar';
import { TypeBadge } from '@/features/pokemon/components/TypeBadge';
import { SkeletonDetailScreen } from '@/features/pokemon/components/SkeletonDetailScreen';
import { usePokemonDetail } from '@/features/pokemon/hooks/usePokemonDetail';
import { capitalize, pokedexNumber } from '@/shared/lib/format';
import { colorForType, palette } from '@/shared/theme/colors';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: pokemon, isLoading, isError, refetch } = usePokemonDetail(id);

  if (isLoading) {
    return <SkeletonDetailScreen />;
  }

  if (isError || !pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar el detalle.</Text>
        <Text style={styles.retry} onPress={() => refetch()}>
          Reintentar
        </Text>
      </View>
    );
  }

  const heroColor = colorForType(pokemon.types[0]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={[styles.hero, { backgroundColor: heroColor, paddingTop: insets.top + 8 }]}>
        <View style={styles.heroHeader}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              size={28}
              color={palette.textPrimary}
            />
          </Pressable>
          <Text style={styles.heroTitle}>Pokédex</Text>
          <Text style={styles.number}>{pokedexNumber(pokemon.id)}</Text>
        </View>
        <Animated.View entering={FadeInUp.duration(300)}>
          <PokemonImage pokemonId={pokemon.id} style={styles.image} />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.duration(300).delay(80)} style={styles.body}>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

        <View style={styles.types}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </View>

        <View style={styles.measures}>
          <View style={styles.measure}>
            <Text style={styles.measureValue}>{pokemon.weightKg} KG</Text>
            <Text style={styles.measureLabel}>Peso</Text>
          </View>
          <View style={styles.measure}>
            <Text style={styles.measureValue}>{pokemon.heightM} M</Text>
            <Text style={styles.measureLabel}>Altura</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Puntos de base</Text>
        <View style={styles.stats}>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.key} stat={stat} />
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    color: palette.textDark,
    fontSize: 16,
  },
  retry: {
    color: palette.header,
    fontSize: 16,
    fontWeight: '700',
  },
  hero: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
  },
  heroTitle: {
    flex: 1,
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  number: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  image: {
    width: 240,
    height: 240,
    marginTop: 8,
  },
  body: {
    paddingHorizontal: 24,
  },
  name: {
    color: palette.textDark,
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 24,
  },
  types: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 20,
  },
  measures: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 28,
  },
  measure: {
    alignItems: 'center',
  },
  measureValue: {
    color: palette.textDark,
    fontSize: 26,
    fontWeight: '800',
  },
  measureLabel: {
    color: palette.textSecondary,
    fontSize: 16,
    marginTop: 6,
  },
  sectionTitle: {
    color: palette.textDark,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  stats: {
    marginTop: 4,
  },
});
