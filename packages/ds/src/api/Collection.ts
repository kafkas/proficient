export interface Collection<E> extends Iterable<E> {
  /**
   * A non-negative integer indicating the number of elements in the collection.
   */
  readonly size: number;

  /**
   * A boolean indicating whether the collection is empty, i.e. its size equals 0.
   */
  readonly isEmpty: boolean;

  /**
   * Empties the collection.
   */
  clear(): void;

  /**
   * Converts the collection into a plain array.
   *
   * @returns A new array containing the items in this collection.
   */
  toArray(): E[];
}
