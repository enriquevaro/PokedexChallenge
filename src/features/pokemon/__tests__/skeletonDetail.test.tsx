jest.mock('react-native-reanimated', () => ({
  useAnimatedStyle: jest.fn(() => ({})),
  useSharedValue: jest.fn((val) => ({ value: val })),
  withRepeat: jest.fn((anim) => anim),
  withTiming: jest.fn((val) => val),
  Animated: {
    View: require('react-native').View,
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

import { render, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SkeletonDetailScreen } from '../components/SkeletonDetailScreen';

describe('SkeletonDetailScreen', () => {
  it('renders skeleton loading state without crashing', async () => {
    await act(async () => {
      const result = render(
        <SafeAreaProvider>
          <SkeletonDetailScreen />
        </SafeAreaProvider>
      );

      // Wait for animation setup
      await new Promise((r) => setTimeout(r, 100));

      // Verify it renders without crashing
      expect(result).toBeDefined();
    });
  });
});
