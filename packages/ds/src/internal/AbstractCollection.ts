import type { Collection } from '../api';
import { EmptyCollectionError } from '../internal/EmptyCollectionError';
import { ImplementationError } from '../internal/ImplementationError';

export abstract class AbstractCollection<E> implements Collection<E> {
  public get isEmpty(): boolean {
    return this.count === 0;
  }

  public toArray(): E[] {
    const arr = new Array<E>(this.count);
    let i = 0;
    for (const elem of this) {
      arr[i++] = elem;
    }
    return arr;
  }

  protected throwEmptyCollectionError(): void {
    throw new EmptyCollectionError();
  }

  protected throwImplementationError(): void {
    throw new ImplementationError();
  }

  public abstract count: number;

  public abstract [Symbol.iterator](): Iterator<E>;

  public abstract clear(): void;
}
