import { KeyboardAvoidingView, Platform } from 'react-native';
import { Stack as RouterStack, router } from 'expo-router';
import { useApiaryStore } from '../../../src/state/useApiaryStore';
import { ApiaryForm } from '../../../src/components/ApiaryForm';
import { Screen } from '../../../src/components/primitives/Screen';
import { styles } from '../../../src/styles/apiaries.styles';
import type { ApiaryInput } from '../../../src/types/Apiary';

export default function NewApiaryScreen() {
  const createApiary = useApiaryStore((state) => state.createApiary);

  const handleSubmit = async (input: ApiaryInput) => {
    const apiary = await createApiary(input);
    router.replace({ pathname: '/apiary/[id]', params: { id: apiary.id } });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <RouterStack.Screen options={{ title: 'New apiary' }} />
      <Screen padding="lg">
        <ApiaryForm submitLabel="Save apiary" onSubmit={handleSubmit} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
