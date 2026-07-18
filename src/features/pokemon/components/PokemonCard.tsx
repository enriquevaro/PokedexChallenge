import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { capitalize } from '@/shared/lib/format';
import { colorForType, palette } from '@/shared/theme/colors';
import type { PokemonListItem } from '../domain/entities';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { PokemonImage } from './PokemonImage';

interface Props {
  pokemon: PokemonListItem;
}

/**
 * Tarjeta de la grilla. Pide el detalle (cacheado) para conocer el tipo
 * y colorear el fondo; de paso deja precargado el detalle, así la
 * pantalla de detalle abre al instante.
 *
 * Nota: sin animaciones `entering` de Reanimated aquí — dentro de celdas
 * recicladas de FlashList provocan items invisibles o vacíos. El fade
 * lo da `transition` de expo-image.
 */
function PokemonCardBase({ pokemon }: Props) {
  const { data } = usePokemonDetail(pokemon.id);
  const backgroundColor = data ? colorForType(data.types[0]) : palette.textDark;

  return (
    <View style={styles.wrapper}>
      <Link href={{ pathname: '/pokemon/[id]', params: { id: String(pokemon.id) } }} asChild>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { backgroundColor, opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalles de ${pokemon.name}`}
        >
          <PokemonImage pokemonId={pokemon.id} style={styles.image} />
          <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

export const PokemonCard = memo(PokemonCardBase);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6, // spacing between cells
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000000',
    overflow: 'hidden',
    backgroundColor: palette.background, // ensure white background inside rounded border
  },
  card: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  image: {
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  name: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '500',
    color: palette.textDark,
    textAlign: 'center',
  },
});
