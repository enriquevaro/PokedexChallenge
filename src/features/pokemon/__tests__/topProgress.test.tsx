import React from 'react';
import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { TopProgressBar } from '@/shared/components/TopProgressBar';

test('TopProgressBar renders when visible', async () => {
  const rendered = await render(<TopProgressBar visible={true} />);
  // flush async effects/animations
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
  expect(rendered.getByTestId('top-progress-bar')).toBeTruthy();
});

test('TopProgressBar not rendered when not visible', async () => {
  const rendered = await render(<TopProgressBar visible={false} />);
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
  expect(rendered.queryByTestId('top-progress-bar')).toBeNull();
});
