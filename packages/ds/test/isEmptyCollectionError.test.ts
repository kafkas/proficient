import { isEmptyCollectionError } from '../src';
import { EmptyCollectionError } from '../src/internal/EmptyCollectionError';

describe('isEmptyCollectionError', () => {
  test('returns true if passed argument is EmptyCollectionError', () => {
    expect(isEmptyCollectionError(new EmptyCollectionError())).toBe(true);
  });

  test('returns false if passed argument is some other Error subclass instance', () => {
    class SomeOtherError extends Error {}
    expect(isEmptyCollectionError(new SomeOtherError())).toBe(false);
  });

  test('returns false if passed argument is plain Error instance', () => {
    expect(isEmptyCollectionError(new Error())).toBe(false);
  });
});
