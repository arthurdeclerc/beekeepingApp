// Style guide: a small honey palette + spacing scale, shared by every component.
export const colors = {
  primary: '#E8A317', // honey amber
  primaryPressed: '#C98A0B',
  onPrimary: '#2B1D00', // dark brown on amber keeps contrast >= 4.5:1
  background: '#FFF8E7', // wax
  surface: '#FFFFFF',
  text: '#2B1D00',
  textMuted: '#6B5B3A',
  border: '#D9C9A3',
  borderFocus: '#C98A0B',
  danger: '#B3261E',
  dangerBackground: '#FDECEA',
} as const;

export const spacing = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const radius = {
  md: 12,
  pill: 999,
} as const;

// Minimum touch target recommended by iOS/Android guidelines.
export const touchTarget = 48;
