import { IndexOutOfBoundsError } from './IndexOutOfBoundsError';

export class StringIndexOutOfBoundsError extends IndexOutOfBoundsError {
  public constructor(index: number, stringLength: number) {
    super(
      `String index out of range: ${index}. Expected a non-negative integer less than ${stringLength}.`
    );
  }
}
