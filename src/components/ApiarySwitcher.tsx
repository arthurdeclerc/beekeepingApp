import { Pressable, ScrollView } from 'react-native';
import { Text } from './primitives/Text';
import { colors } from '../theme/theme';
import { styles } from './ApiarySwitcher.styles';
import type { Apiary } from '../types/Apiary';

interface ApiarySwitcherProps {
  apiaries: Apiary[];
  activeId: string;
  onSelect: (id: string) => void;
}

// Switch between apiaries with a single tap.
export function ApiarySwitcher({ apiaries, activeId, onSelect }: ApiarySwitcherProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {apiaries.map((apiary) => {
        const isActive = apiary.id === activeId;
        return (
          <Pressable
            key={apiary.id}
            onPress={() => onSelect(apiary.id)}
            style={[styles.chip, isActive && styles.chipActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            testID={`switch-apiary-${apiary.id}`}
          >
            <Text weight={isActive ? 'bold' : 'medium'} color={isActive ? colors.onPrimary : colors.text}>
              {apiary.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
