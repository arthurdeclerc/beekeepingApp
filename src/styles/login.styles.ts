import { StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

export const LOGO_RATIO = 487 / 405; // width / height of the source image
const LOGO_MAX_HEIGHT = 300;
const LOGO_MIN_HEIGHT = 90;
// Space the form, texts and padding need below the logo (px).
const SPACE_BELOW_LOGO = 330;
// Horizontal screen padding (2 x spacing.lg) the logo must stay inside.
const SCREEN_SIDE_PADDING = 48;

// Shrinks the logo on short screens so the whole form fits without scrolling,
// and never makes it wider than the screen.
export function getLogoSize(windowWidth: number, windowHeight: number): { width: number; height: number } {
  const height = Math.min(
    LOGO_MAX_HEIGHT,
    (windowWidth - SCREEN_SIDE_PADDING) / LOGO_RATIO,
    Math.max(LOGO_MIN_HEIGHT, windowHeight - SPACE_BELOW_LOGO),
  );
  return { width: height * LOGO_RATIO, height };
}

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', width: '100%', maxWidth: 420, alignSelf: 'center' },
  formError: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBackground,
  },
});
