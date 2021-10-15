import { EmptyCollectionError } from './internal/EmptyCollectionError';

export function isEmptyCollectionError(err: unknown): err is EmptyCollectionError {
  return err instanceof EmptyCollectionError;
}
