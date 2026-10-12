import { ScrollView, View } from 'react-native';
import { styles } from './Screen.styles';

interface ScreenProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  scrollable?: boolean;
}

export function Screen({ children, padding = 'md', scrollable = true }: ScreenProps) {
  if (!scrollable) {
    return (
      <View style={[styles.container, styles[padding]]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, styles[padding]]}>
      {children}
    </ScrollView>
  );
}
