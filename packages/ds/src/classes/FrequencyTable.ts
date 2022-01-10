import { AbstractCollection } from '../internal';

/**
 * An object that can be used to efficiently store and manage the frequencies of
 * the specified keys.
 */
export class FrequencyTable<K extends string | number> extends AbstractCollection<[K, number]> {
  #map: Map<K, number>;
  #total: number;

  /**
   * The sum of the frequencies of all the keys in the table.
   */
  public get total(): number {
    return this.#total;
  }

  /**
   * The number of keys whose frequency is positive.
   */
  public get count(): number {
    return this.#map.size;
  }

  public constructor() {
    super();
    this.#map = new Map();
    this.#total = 0;
  }

  public [Symbol.iterator](): Iterator<[K, number]> {
    return this.#map.entries();
  }

  /**
   * Empties the table.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   */
  public clear(): void {
    this.#map = new Map();
    this.#total = 0;
  }

  /**
   * Increases the frequency of the specified key by 1.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   *
   * @param key - The key whose frequency to increment.
   */
  public increment(key: K): void {
    const prev = this.frequencyOf(key);
    this.#map.set(key, prev + 1);
    this.#total++;
  }

  /**
   * If the frequency of the specified key is positive, decreases it by 1. Otherwise (if it's 0),
   * doesn't do anything.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   *
   * @param key - The key whose frequency to decrement.
   */
  public decrement(key: K): void {
    const prev = this.frequencyOf(key);
    if (prev === 1) {
      this.#map.delete(key);
      this.#total--;
    } else if (prev > 1) {
      this.#map.set(key, prev - 1);
      this.#total--;
    }
  }

  /**
   * Retrieves the frequency of the specified key. Returns 0, if the key doesn't exist in the table.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   *
   * @param key - The key whose frequency to decrement.
   * @returns A non-negative integer indicating the frequency of the specified key.
   */
  public frequencyOf(key: K): number {
    return this.#map.get(key) ?? 0;
  }
}
