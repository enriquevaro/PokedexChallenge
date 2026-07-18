import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/shared/theme/colors';

const badgeColors: Record<string, string> = {
  normal: '#8A8A5C',
  fire: '#D2691E',
  water: '#3B76B8',
  electric: '#C7A008',
  grass: '#2E7D46',
  ice: '#4FA3A3',
  fighting: '#A8453A',
  poison: '#6E2E9E',
  ground: '#A8823C',
  flying: '#5A6FBF',
  psychic: '#C24E75',
  bug: '#7A8A1E',
  rock: '#8A7A3C',
  ghost: '#4E4278',
  dragon: '#4E3CB8',
  dark: '#4A4038',
  steel: '#7878A0',
  fairy: '#C25E9E',
};

interface Props {
  type: string;
}

export function TypeBadge({ type }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: badgeColors[type] ?? '#5A6E8C' }]}>
      <Text style={styles.text}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
  text: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
});
