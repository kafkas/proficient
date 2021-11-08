import { ImplementationError } from './internal/ImplementationError';

export function isImplementationError(err: unknown): err is ImplementationError {
  return err instanceof ImplementationError;
}
