import { RefreshControl, ScrollView, View } from 'react-native';
import { styles } from './Screen.styles';

interface ScreenProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  scrollable?: boolean;
  // Pull to refresh: both must be set to enable it.
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function Screen({
  children,
  padding = 'md',
  scrollable = true,
  refreshing = false,
  onRefresh,
}: ScreenProps) {
  if (!scrollable) {
    return (
      <View style={[styles.container, styles[padding]]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, styles[padding]]}
      refreshControl={
        onRefresh === undefined ? undefined : (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        )
      }
    >
      {children}
    </ScrollView>
  );
}
