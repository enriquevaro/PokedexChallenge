import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/shared/theme/colors';

/**
 * Skeleton tile that mimics the PokemonCard layout with a shimmer effect.
 */
export function SkeletonTile() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-1, 1],
  }) as any;

  return (
    <View testID="skeleton-tile" style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder}>
          <Animated.View
            testID="skeleton-shimmer"
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: Animated.multiply(shimmerX, 200) }],
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>
        </View>
        <View style={styles.namePlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: palette.trackLight,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000000',
  },
  card: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#dcdcdc',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
  },
  namePlaceholder: {
    marginTop: 16,
    width: 100,
    height: 18,
    borderRadius: 8,
    backgroundColor: '#dcdcdc',
  },
});
