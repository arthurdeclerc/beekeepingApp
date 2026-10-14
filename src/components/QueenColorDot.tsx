import { View } from 'react-native';
import { colors } from '../theme/theme';
import { queenColorForYear } from '../utils/queenColor';

interface QueenColorDotProps {
  year: number;
  size?: number;
}

// The international marking colour for a queen born in the given year.
export function QueenColorDot({ year, size = 16 }: QueenColorDotProps) {
  const color = queenColorForYear(year);
  return (
    <View
      accessibilityLabel={`${color.label} marking`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color.hex,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    />
  );
}
