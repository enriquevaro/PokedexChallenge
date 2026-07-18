import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { palette } from '@/shared/theme/colors';

export function TopProgressBar({ visible }: { visible: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      return;
    }

    // Indeterminate animation: grow width from 0 to 1, loop
    const animate = () => {
      progress.setValue(0);
      animationRef.current = Animated.timing(progress, {
        toValue: 1,
        duration: 900,
        useNativeDriver: false,
      });
      animationRef.current.start(({ finished }) => {
        if (finished) animate();
      });
    };

    animate();

    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, [visible, progress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '85%'],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {visible && (
        <Animated.View testID="top-progress-bar" style={[styles.bar, { width: widthInterpolated }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  bar: {
    height: 3,
    backgroundColor: palette.header,
    borderRadius: 2,
    marginHorizontal: 12,
  },
});
