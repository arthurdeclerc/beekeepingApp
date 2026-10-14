import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { InputField } from './primitives/InputField';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { QueenColorDot } from './QueenColorDot';
import { StyledButton } from './StyledButton';
import { colors } from '../theme/theme';
import { messageForError } from '../utils/errorMessages';
import { HIVE_TYPES, HIVE_TYPE_LABELS } from '../utils/hiveTypes';
import { queenColorForYear } from '../utils/queenColor';
import { styles } from './HiveForm.styles';
import type { HiveInput, HiveType } from '../types/Hive';

// Same limits as the check constraints in the database.
const NAME_MAX = 80;
const NOTES_MAX = 2000;
const BREED_MAX = 80;
const YEAR_MIN = 2000;
const YEAR_MAX = 2100;

const EMPTY_INPUT: HiveInput = {
  name: '',
  type: 'dadant',
  notes: '',
  queen: { birthYear: undefined, breed: '', isMarked: false, isClipped: false, isMated: false },
};

interface HiveFormProps {
  initialValues?: HiveInput;
  submitLabel: string;
  onSubmit: (input: HiveInput) => Promise<void>;
}

interface ToggleChipProps {
  label: string;
  isActive: boolean;
  disabled: boolean;
  onPress: () => void;
  role: 'radio' | 'checkbox';
  testID: string;
}

function ToggleChip({ label, isActive, disabled, onPress, role, testID }: ToggleChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, isActive && styles.chipActive]}
      accessibilityRole={role}
      accessibilityState={role === 'radio' ? { selected: isActive } : { checked: isActive }}
      testID={testID}
    >
      <Text weight={isActive ? 'bold' : 'medium'} color={isActive ? colors.onPrimary : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
}

// Empty means "unknown"; otherwise a plausible four digit year, or undefined when invalid.
function parseYear(text: string): number | undefined | 'invalid' {
  const trimmed = text.trim();
  if (trimmed === '') return undefined;
  if (!/^\d{4}$/.test(trimmed)) return 'invalid';
  const year = Number(trimmed);
  return year >= YEAR_MIN && year <= YEAR_MAX ? year : 'invalid';
}

export function HiveForm({ initialValues = EMPTY_INPUT, submitLabel, onSubmit }: HiveFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [type, setType] = useState<HiveType>(initialValues.type);
  const [notes, setNotes] = useState(initialValues.notes);
  const [yearText, setYearText] = useState(initialValues.queen.birthYear?.toString() ?? '');
  const [breed, setBreed] = useState(initialValues.queen.breed);
  const [isMarked, setIsMarked] = useState(initialValues.queen.isMarked);
  const [isClipped, setIsClipped] = useState(initialValues.queen.isClipped);
  const [isMated, setIsMated] = useState(initialValues.queen.isMated);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [yearError, setYearError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const previewYear = parseYear(yearText);

  const handleSubmit = async () => {
    setFormError(undefined);
    const birthYear = parseYear(yearText);
    const nameMissing = name.trim() === '';
    const yearInvalid = birthYear === 'invalid';
    setNameError(nameMissing ? 'Enter a name or number.' : undefined);
    setYearError(yearInvalid ? `Enter a year between ${YEAR_MIN} and ${YEAR_MAX}, or leave it empty.` : undefined);
    if (nameMissing || birthYear === 'invalid') return;

    setIsSaving(true);
    try {
      await onSubmit({ name, type, notes, queen: { birthYear, breed, isMarked, isClipped, isMated } });
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
            {HIVE_TYPES.map((option) => (
              <ToggleChip
                key={option}
                label={HIVE_TYPE_LABELS[option]}
                isActive={option === type}
                disabled={isSaving}
                onPress={() => setType(option)}
                role="radio"
                testID={`hive-type-${option}`}
              />
            ))}
          </View>
        </Stack>

        <Text size="lg" weight="bold">Queen</Text>
        <InputField
          label="Birth year (optional)"
          value={yearText}
          onChangeText={setYearText}
          placeholder="2025"
          keyboardType="number-pad"
          maxLength={4}
          error={yearError}
          editable={!isSaving}
          testID="queen-year-input"
        />
        {typeof previewYear === 'number' && (
          <View style={styles.colorRow} testID="queen-color-preview">
            <QueenColorDot year={previewYear} size={20} />
            <Text size="sm" color={colors.textMuted}>
              Mark this queen {queenColorForYear(previewYear).label.toLowerCase()}
            </Text>
          </View>
        )}
        <InputField
          label="Breed (optional)"
          value={breed}
          onChangeText={setBreed}
          placeholder="Buckfast"
          autoCapitalize="words"
          maxLength={BREED_MAX}
          editable={!isSaving}
          testID="queen-breed-input"
        />
        <View style={styles.typeRow}>
          <ToggleChip
            label="Marked"
            isActive={isMarked}
            disabled={isSaving}
            onPress={() => setIsMarked(!isMarked)}
            role="checkbox"
            testID="queen-marked-toggle"
          />
          <ToggleChip
            label="Clipped"
            isActive={isClipped}
            disabled={isSaving}
            onPress={() => setIsClipped(!isClipped)}
            role="checkbox"
            testID="queen-clipped-toggle"
          />
          <ToggleChip
            label="Mated"
            isActive={isMated}
            disabled={isSaving}
            onPress={() => setIsMated(!isMated)}
            role="checkbox"
            testID="queen-mated-toggle"
          />
        </View>

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
