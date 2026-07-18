import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/shared/theme/colors';

export function SkeletonDetailScreen() {
  const insets = useSafeAreaInsets();
  const shimmerTranslateX = useSharedValue(-300);

  // Animate shimmer from left to right
  shimmerTranslateX.value = withRepeat(
    withTiming(300, { duration: 1500 }),
    -1,
    true
  );

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  const SkeletonBox = ({ width = '100%', height = 20, style }: any) => (
    <View style={[{ width, height, borderRadius: 8, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ flex: 1 }, shimmerStyle]}>
        <LinearGradient
          colors={[palette.trackLight, palette.trackLight, palette.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 300, height: '100%' }}
        />
      </Animated.View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Hero skeleton */}
      <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <View style={styles.heroHeader}>
          <View style={{ width: 28, height: 28, borderRadius: 4, backgroundColor: palette.trackLight }} />
          <View style={{ flex: 1, height: 22, borderRadius: 8, backgroundColor: palette.trackLight }} />
          <View style={{ width: 40, height: 28, borderRadius: 8, backgroundColor: palette.trackLight }} />
        </View>
        {/* Image skeleton */}
        <View style={styles.imageSkeleton} />
      </View>

      {/* Body skeleton */}
      <View style={styles.body}>
        {/* Name skeleton */}
        <SkeletonBox height={48} style={{ marginTop: 24 }} />

        {/* Types skeleton */}
        <View style={styles.types}>
          <View style={{ width: 80, height: 24, borderRadius: 12, backgroundColor: palette.trackLight }} />
          <View style={{ width: 80, height: 24, borderRadius: 12, backgroundColor: palette.trackLight }} />
        </View>

        {/* Measures skeleton */}
        <View style={styles.measures}>
          <View style={styles.measure}>
            <SkeletonBox width={60} height={28} />
            <SkeletonBox width={60} height={16} style={{ marginTop: 6 }} />
          </View>
          <View style={styles.measure}>
            <SkeletonBox width={60} height={28} />
            <SkeletonBox width={60} height={16} style={{ marginTop: 6 }} />
          </View>
        </View>

        {/* Section title skeleton */}
        <SkeletonBox height={28} style={{ marginTop: 28, marginBottom: 8, width: '60%', alignSelf: 'center' }} />

        {/* Stats skeleton */}
        <View style={styles.stats}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <SkeletonBox width={60} height={16} />
                <SkeletonBox width={40} height={16} />
              </View>
              <SkeletonBox height={26} style={{ borderRadius: 4 }} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  hero: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
  },
  imageSkeleton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginTop: 8,
    backgroundColor: palette.trackLight,
  },
  body: {
    paddingHorizontal: 24,
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
  stats: {
    marginTop: 4,
  },
});
