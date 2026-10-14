import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuthStore } from '../src/state/useAuthStore';
import { AuthFailure } from '../src/services/authService';
import { Alert } from '../src/components/Alert';
import { CenteredColumn } from '../src/components/CenteredColumn';
import { Logo } from '../src/components/Logo';
import { InputField } from '../src/components/primitives/InputField';
import { StyledButton } from '../src/components/StyledButton';
import { Screen } from '../src/components/primitives/Screen';
import { Stack } from '../src/components/primitives/Stack';
import { Text } from '../src/components/primitives/Text';
import { colors } from '../src/theme/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

function errorMessageFor(error: unknown): string {
  if (error instanceof AuthFailure) {
    if (error.reason === 'invalid_credentials') return 'Incorrect email or password.';
    if (error.reason === 'network') return 'No connection. Check your internet and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const { login, isLoading, isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />;

  const validate = (): boolean => {
    const emailMessage = EMAIL_PATTERN.test(email.trim()) ? undefined : 'Enter a valid email address.';
    const passwordMessage = password === '' ? 'Enter your password.' : undefined;
    setEmailError(emailMessage);
    setPasswordError(passwordMessage);
    return emailMessage === undefined && passwordMessage === undefined;
  };

  const handleLogin = async () => {
    setFormError(undefined);

    // Client-side throttle for UX; Supabase also rate-limits on the server.
    const waitMs = lockedUntil - Date.now();
    if (waitMs > 0) {
      setFormError(`Too many attempts. Try again in ${Math.ceil(waitMs / 1000)} seconds.`);
      return;
    }
    if (!validate()) return;

    try {
      await login({ email, password });
      setFailedAttempts(0);
      router.replace('/');
    } catch (error) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setFailedAttempts(0);
      }
      setPassword('');
      setFormError(errorMessageFor(error));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen padding="lg">
        <CenteredColumn>
          <Stack gap="lg">
            <Stack gap="sm" align="center">
              <Logo />
            </Stack>

            <Stack gap="md">
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="username"
                returnKeyType="next"
                error={emailError}
                editable={!isLoading}
                testID="email-input"
              />
              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                error={passwordError}
                editable={!isLoading}
                testID="password-input"
              />
              {formError !== undefined && (
                <Alert testID="login-error">
                  <Text size="sm" color={colors.danger}>{formError}</Text>
                </Alert>
              )}
            </Stack>

            <StyledButton
              label="Log in"
              onPress={handleLogin}
              isLoading={isLoading}
              testID="login-button"
            />
          </Stack>
        </CenteredColumn>
      </Screen>
    </KeyboardAvoidingView>
  );
}
