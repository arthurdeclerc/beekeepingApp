export type QueenColorName = 'white' | 'yellow' | 'red' | 'green' | 'blue';

interface QueenColor {
  name: QueenColorName;
  label: string;
  hex: string;
}

// International queen marking colours, repeating every five years (by last digit of the year).
const COLORS_BY_LAST_DIGIT: Record<number, QueenColor> = {
  1: { name: 'white', label: 'White', hex: '#FFFFFF' },
  6: { name: 'white', label: 'White', hex: '#FFFFFF' },
  2: { name: 'yellow', label: 'Yellow', hex: '#F5D90A' },
  7: { name: 'yellow', label: 'Yellow', hex: '#F5D90A' },
  3: { name: 'red', label: 'Red', hex: '#D32F2F' },
  8: { name: 'red', label: 'Red', hex: '#D32F2F' },
  4: { name: 'green', label: 'Green', hex: '#2E7D32' },
  9: { name: 'green', label: 'Green', hex: '#2E7D32' },
  5: { name: 'blue', label: 'Blue', hex: '#1565C0' },
  0: { name: 'blue', label: 'Blue', hex: '#1565C0' },
};

export function queenColorForYear(year: number): QueenColor {
  const color = COLORS_BY_LAST_DIGIT[Math.abs(year) % 10];
  // Every digit 0-9 is in the table, so this never happens; keeps the type honest.
  if (color === undefined) throw new Error('No queen colour for year');
  return color;
}
