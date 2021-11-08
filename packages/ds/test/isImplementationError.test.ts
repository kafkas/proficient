import { isImplementationError } from '../src';
import { ImplementationError } from '../src/internal/ImplementationError';

describe('isImplementationError', () => {
  test('returns true if passed argument is ImplementationError', () => {
    expect(isImplementationError(new ImplementationError())).toBe(true);
  });

  test('returns false if passed argument is some other Error subclass instance', () => {
    class SomeOtherError extends Error {}
    expect(isImplementationError(new SomeOtherError())).toBe(false);
  });

  test('returns false if passed argument is plain Error instance', () => {
    expect(isImplementationError(new Error())).toBe(false);
  });
});
