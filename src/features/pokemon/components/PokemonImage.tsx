import { Image, type ImageStyle } from 'expo-image';
import { useEffect, useState } from 'react';
import type { StyleProp } from 'react-native';
import { imageUrlCandidates } from '../data/mappers';

interface Props {
  pokemonId: number;
  style?: StyleProp<ImageStyle>;
}

/**
 * Imagen con cadena de fallbacks: si el CDN principal falla
 * (redes que bloquean ciertos hosts, típico en Android), intenta
 * el siguiente origen. `recyclingKey` evita mostrar la imagen de
 * otro pokémon al reciclar celdas en FlashList.
 */
export function PokemonImage({ pokemonId, style }: Props) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const candidates = imageUrlCandidates(pokemonId);

  // Al reciclarse la celda con otro pokémon, reinicia la cadena.
  useEffect(() => {
    setSourceIndex(0);
  }, [pokemonId]);

  return (
    <Image
      source={{ uri: candidates[Math.min(sourceIndex, candidates.length - 1)] }}
      style={style}
      contentFit="contain"
      transition={200}
      cachePolicy="memory-disk"
      recyclingKey={String(pokemonId)}
      onError={() =>
        setSourceIndex((i) => (i + 1 < candidates.length ? i + 1 : i))
      }
    />
  );
}
