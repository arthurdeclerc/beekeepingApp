import { useState } from 'react';
import { View } from 'react-native';
import { InputField } from './primitives/InputField';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { StyledButton } from './StyledButton';
import { colors } from '../theme/theme';
import { messageForError } from '../utils/errorMessages';
import { styles } from './ApiaryForm.styles';
import type { ApiaryInput } from '../types/Apiary';

// Same limits as the check constraints in the database.
const NAME_MAX = 80;
const ADDRESS_MAX = 200;
const NOTES_MAX = 2000;

interface ApiaryFormProps {
  initialValues?: ApiaryInput;
  submitLabel: string;
  onSubmit: (input: ApiaryInput) => Promise<void>;
}

export function ApiaryForm({ initialValues, submitLabel, onSubmit }: ApiaryFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [address, setAddress] = useState(initialValues?.address ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setFormError(undefined);
    if (name.trim() === '') {
      setNameError('Enter a name.');
      return;
    }
    setNameError(undefined);

    setIsSaving(true);
    try {
      await onSubmit({ name, address, notes });
    } catch (error) {
      setFormError(messageForError(error));
      setIsSaving(false);
    }
  };

  return (
    <Stack gap="lg">
      <Stack gap="md">
        <InputField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Forest Edge"
          autoCapitalize="words"
          maxLength={NAME_MAX}
          returnKeyType="next"
          error={nameError}
          editable={!isSaving}
          testID="apiary-name-input"
        />
        <InputField
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Hoogstraat 12, Leuven"
          autoCapitalize="words"
          autoComplete="street-address"
          maxLength={ADDRESS_MAX}
          returnKeyType="next"
          editable={!isSaving}
          testID="apiary-address-input"
        />
        <InputField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Windy spot, shade after 4 pm"
          autoCapitalize="sentences"
          multiline
          maxLength={NOTES_MAX}
          editable={!isSaving}
          testID="apiary-notes-input"
        />
        {formError !== undefined && (
          <View style={styles.formError} accessibilityRole="alert" testID="apiary-form-error">
            <Text size="sm" color={colors.danger}>{formError}</Text>
          </View>
        )}
      </Stack>
      <StyledButton
        label={submitLabel}
        onPress={handleSubmit}
        isLoading={isSaving}
        testID="apiary-save-button"
      />
    </Stack>
  );
}
