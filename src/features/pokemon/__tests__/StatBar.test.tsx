import { render } from '@testing-library/react-native';
import { StatBar } from '../components/StatBar';
import type { PokemonStat } from '../domain/entities';

describe('StatBar', () => {
  it('muestra la etiqueta y el valor', async () => {
    const stat: PokemonStat = { key: 'hp', label: 'HP', value: 45, max: 300 };
    // En @testing-library/react-native v14, render es asíncrono.
    const { getByText } = await render(<StatBar stat={stat} />);

    expect(getByText('HP')).toBeTruthy();
    expect(getByText('45/300')).toBeTruthy();
  });
});
