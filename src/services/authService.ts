import { AppState } from 'react-native';
import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import type { AuthFailureReason, Credentials } from '../types/Auth';
import type { User } from '../types/User';

export class AuthFailure extends Error {
  readonly reason: AuthFailureReason;

  constructor(reason: AuthFailureReason) {
    // Never include server details or the credentials in the message.
    super(reason);
    this.name = 'AuthFailure';
    this.reason = reason;
  }
}

function toUser(session: Session): User {
  const { user, access_token } = session;
  const metadataName: unknown = user.user_metadata['name'];
  const email = user.email ?? '';
  return {
    id: user.id,
    email,
    name: typeof metadataName === 'string' && metadataName !== '' ? metadataName : email,
    token: access_token,
  };
}

export async function login({ email, password }: Credentials): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error !== null) {
    if (isAuthRetryableFetchError(error)) throw new AuthFailure('network');
    if (error.code === 'invalid_credentials') throw new AuthFailure('invalid_credentials');
    throw new AuthFailure('unknown');
  }
  return toUser(data.session);
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error !== null) throw new AuthFailure('unknown');
}

// Fires once with the stored session (or undefined) and again on every login, logout,
// token refresh and expiry. Returns a cleanup function.
export function watchSession(onChange: (user: User | undefined) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    // Keep this synchronous: calling Supabase from inside the callback can deadlock.
    onChange(session === null ? undefined : toUser(session));
  });

  // Only refresh the JWT while the app is in the foreground.
  const appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
  void supabase.auth.startAutoRefresh();

  return () => {
    data.subscription.unsubscribe();
    appStateSubscription.remove();
    void supabase.auth.stopAutoRefresh();
  };
}
