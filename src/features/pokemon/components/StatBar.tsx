import { StyleSheet, Text, View } from 'react-native';
import { palette, statColors } from '@/shared/theme/colors';
import type { PokemonStat } from '../domain/entities';

interface Props {
  stat: PokemonStat;
}

/** Barra de estadística tipo píldora, según el diseño. */
export function StatBar({ stat }: Props) {
  const pct = Math.min(stat.value / stat.max, 1);
  const color = statColors[stat.key] ?? palette.header;
  const labelInside = pct > 0.3;
  const valueText = `${stat.value}/${stat.max}`;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{stat.label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]}>
          {labelInside && <Text style={styles.valueInside}>{valueText}</Text>}
        </View>
        {!labelInside && <Text style={styles.valueOutside}>{valueText}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    width: 56,
    color: palette.textDark,
    fontSize: 16,
    fontWeight: '700',
  },
  track: {
    flex: 1,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.trackLight,
    // Use relative positioning so the fill can be sized absolutely by percent
    position: 'relative',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  valueInside: {
    color: palette.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    // Ensure vertical centering on Android by matching lineHeight to track height
    lineHeight: 26,
  },
  valueOutside: {
    position: 'absolute',
    right: 10,
    color: '#3A3A3A',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 26,
  },
});
