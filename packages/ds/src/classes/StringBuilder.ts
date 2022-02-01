import type { CharSequenceLike } from '../types';
import { stringify } from '../internal/util';
import { IllegalArgumentError, StringIndexOutOfBoundsError } from '../errors';

/**
 * An object that represents a mutable sequence of characters.
 */
export class StringBuilder {
  #chars: string[];

  /**
   * The number of characters in this sequence.
   */
  public get count(): number {
    return this.#chars.length;
  }

  public constructor();

  public constructor(seq: string);

  public constructor(seq?: string) {
    this.#chars = typeof seq === 'string' ? seq.split('') : [];
  }

  /**
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   */
  public clear(): void {
    this.#chars = [];
  }

  /**
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   */
  public charAt(index: number): string {
    this.#validateIndex(index);
    return this.#chars[index];
  }

  /**
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   */
  public setCharAt(index: number, char: string): this {
    this.#validateIndex(index);
    this.#validateChar(char);
    this.#chars[index] = char;
    return this;
  }

  /**
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(_N_) (worst case)
   * - Space complexity: _O_(1)
   *
   * where:
   *
   * - _N_: character count of this sequence
   */
  public deleteCharAt(index: number): this {
    this.#validateIndex(index);
    return this.delete(index, index + 1);
  }

  /**
   * @param startIndex - The beginning index, inclusive.
   * @param endIndex - The ending index, exclusive.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(_N_) (worst case)
   * - Space complexity: _O_(1)
   *
   * where:
   *
   * - _N_: character count of this sequence
   */
  public delete(startIndex: number, endIndex: number): this {
    this.#validateIndex(startIndex);
    const endIdxAdjusted = endIndex > this.count ? this.count : endIndex;
    if (startIndex > endIdxAdjusted) {
      throw new IllegalArgumentError(
        `Invalid range ${[startIndex, endIndex]}. Beginning index must not exceed ending index.`
      );
    }
    this.#chars.splice(startIndex, endIdxAdjusted - startIndex);
    return this;
  }

  /**
   * Appends a sequence of characters to this sequence.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(_S_) (amortized)
   * - Space complexity: _O_(1) (amortized)
   *
   * where:
   *
   * - _S_: character count of the new sequence to be appended
   */
  public append(seq: CharSequenceLike): this {
    if (seq === '') return this;
    const newSeqChars = this.#getCharsOf(seq);
    for (let i = 0; i < newSeqChars.length; i++) {
      const char = newSeqChars[i];
      this.#chars.push(char);
    }
    return this;
  }

  /**
   * Inserts a sequence of characters into this sequence at the specified index.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(_N_ + _S_)
   * - Space complexity: _O_(1) (amortized)
   *
   * where:
   *
   * - _N_: character count of this sequence
   * - _S_: character count of the new sequence to be inserted
   */
  public insert(index: number, seq: CharSequenceLike): this {
    this.#validateIndexEndIncluded(index);
    if (seq === '') return this;
    const newSeqChars = this.#getCharsOf(seq);
    // Resize the chars array
    this.#chars[this.count + newSeqChars.length - 1] = '';
    // Shift every char at i >= index to the right by newSeqChars.length
    for (let i = this.count - newSeqChars.length - 1; i >= index; i--) {
      this.#chars[i + newSeqChars.length] = this.#chars[i];
    }
    // Add each new char to the appropriate location
    for (let i = index; i < index + newSeqChars.length; i++) {
      this.#chars[i] = newSeqChars[i - index];
    }
    return this;
  }

  #validateIndex(index: number): void {
    if (index < 0 || index >= this.count) {
      throw new StringIndexOutOfBoundsError(index, this.count);
    }
  }

  #validateIndexEndIncluded(index: number): void {
    if (index < 0 || index > this.count) {
      throw new StringIndexOutOfBoundsError(index, this.count + 1);
    }
  }

  #validateChar(candidate: string): void {
    if (candidate.length !== 1) {
      throw new IllegalArgumentError(`"${candidate}" is not a valid character.`);
    }
  }

  /**
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   */
  #getCharsOf(seq: CharSequenceLike): string | string[] {
    if (typeof seq === 'string') return seq;
    if (seq instanceof StringBuilder) return seq.#chars;
    return stringify(seq);
  }

  /**
   * Builds and returns the character sequence represented by this object.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(_N_)
   * - Space complexity: _O_(_N_)
   *
   * where:
   *
   * - _N_: character count of this sequence
   */
  public toString(): string {
    return this.#chars.join('');
  }
}
