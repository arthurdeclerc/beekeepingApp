export type AuthFailureReason = 'invalid_credentials' | 'network' | 'unknown';

export interface Credentials {
  email: string;
  password: string;
}
