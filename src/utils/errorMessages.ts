import { ServiceError } from '../services/serviceError';

export function messageForError(error: unknown): string {
  if (error instanceof ServiceError) {
    switch (error.reason) {
      case 'network':
        return 'No connection. Check your internet and try again.';
      case 'forbidden':
        return 'You do not have permission to do that.';
      case 'not_found':
        return 'This item no longer exists.';
      case 'invalid':
        return 'Some of the values are not allowed. Check the fields and try again.';
      case 'duplicate':
        return 'That name is already in use here. Choose another one.';
      case 'unknown':
        break;
    }
  }
  return 'Something went wrong. Please try again.';
}
