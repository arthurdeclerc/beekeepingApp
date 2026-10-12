import type { PostgrestError } from '@supabase/supabase-js';

export type ServiceErrorReason = 'network' | 'forbidden' | 'not_found' | 'invalid' | 'unknown';

export class ServiceError extends Error {
  readonly reason: ServiceErrorReason;

  constructor(reason: ServiceErrorReason) {
    // Never put server details in the message; screens show their own friendly text.
    super(reason);
    this.name = 'ServiceError';
    this.reason = reason;
  }
}

export function toServiceError(error: PostgrestError): ServiceError {
  if (error.code === '42501') return new ServiceError('forbidden'); // row level security
  if (error.code === 'PGRST116') return new ServiceError('not_found');
  if (error.code === '23514' || error.code === '22001') return new ServiceError('invalid'); // check / length
  if (/fetch|network/i.test(error.message)) return new ServiceError('network');
  return new ServiceError('unknown');
}
