import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { InputField } from './primitives/InputField';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { StyledButton } from './StyledButton';
import { colors } from '../theme/theme';
import { messageForError } from '../utils/errorMessages';
import { HIVE_TYPES, HIVE_TYPE_LABELS } from '../utils/hiveTypes';
import { styles } from './HiveForm.styles';
import type { HiveInput, HiveType } from '../types/Hive';

// Same limits as the check constraints in the database.
const NAME_MAX = 80;
const NOTES_MAX = 2000;

interface HiveFormProps {
  submitLabel: string;
  onSubmit: (input: HiveInput) => Promise<void>;
}

export function HiveForm({ submitLabel, onSubmit }: HiveFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<HiveType>('dadant');
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setFormError(undefined);
    if (name.trim() === '') {
      setNameError('Enter a name or number.');
      return;
    }
    setNameError(undefined);

    setIsSaving(true);
    try {
      await onSubmit({ name, type, notes });
    } catch (error) {
      setFormError(messageForError(error));
      setIsSaving(false);
    }
  };

  return (
    <Stack gap="lg">
      <Stack gap="md">
        <InputField
          label="Name or number"
          value={name}
          onChangeText={setName}
          placeholder="Hive 1"
          autoCapitalize="words"
          maxLength={NAME_MAX}
          returnKeyType="next"
          error={nameError}
          editable={!isSaving}
          testID="hive-name-input"
        />
        <Stack gap="sm">
          <Text weight="medium">Hive type</Text>
          <View style={styles.typeRow} accessibilityRole="radiogroup">
            {HIVE_TYPES.map((option) => {
              const isActive = option === type;
              return (
                <Pressable
                  key={option}
                  onPress={() => setType(option)}
                  disabled={isSaving}
                  style={[styles.chip, isActive && styles.chipActive]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isActive }}
                  testID={`hive-type-${option}`}
                >
                  <Text
                    weight={isActive ? 'bold' : 'medium'}
                    color={isActive ? colors.onPrimary : colors.text}
                  >
                    {HIVE_TYPE_LABELS[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Stack>
        <InputField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Strong colony, caught as a swarm"
          autoCapitalize="sentences"
          multiline
          maxLength={NOTES_MAX}
          editable={!isSaving}
          testID="hive-notes-input"
        />
        {formError !== undefined && (
          <View style={styles.formError} accessibilityRole="alert" testID="hive-form-error">
            <Text size="sm" color={colors.danger}>{formError}</Text>
          </View>
        )}
      </Stack>
      <StyledButton
        label={submitLabel}
        onPress={handleSubmit}
        isLoading={isSaving}
        testID="hive-save-button"
      />
    </Stack>
  );
}
