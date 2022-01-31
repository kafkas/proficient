import type { CharSequenceLike } from '../internal';
import { stringify } from '../internal/util';
import { IllegalArgumentError, StringIndexOutOfBoundsError } from '../errors';

/**
 * An object that represents a mutable sequence of characters.
 */
export class StringBuilder {
  #chars: string[];

  /**
   * Character count.
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
   * - _S_: character count of the new sequence to be appended
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
   * - _S_: character count of the new sequence to be appended
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
   * Appends a string of characters to the sequence.
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
    if (seq !== '') {
      let chars: string | string[] | undefined;
      if (typeof seq === 'string') {
        chars = seq;
      } else if (seq instanceof StringBuilder) {
        chars = seq.#chars;
      } else {
        chars = stringify(seq);
      }
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        this.#chars.push(char);
      }
    }
    return this;
  }

  /**
   * Appends a string of characters to the sequence.
   *
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(_N_ + _S_)
   * - Space complexity: _O_(_N_ + _S_)
   *
   * where:
   *
   * - _N_: character count of the sequence
   * - _S_: character count of the new sequence to be inserted
   */
  public insert(index: number, seq: CharSequenceLike): this {
    this.#validateIndexEndIncluded(index);
    if (seq === '') return this;
    const newSeqChars = this.#getCharsOf(seq);
    const chars = new Array<string>(this.#chars.length + newSeqChars.length);
    for (let i = 0; i < chars.length; i++) {
      if (i < index) {
        chars[i] = this.#chars[i];
      } else if (i >= index && i < index + newSeqChars.length) {
        chars[i] = newSeqChars[i - index];
      } else {
        chars[i] = this.#chars[i - newSeqChars.length];
      }
    }
    this.#chars = chars;
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

  #getCharsOf(seq: CharSequenceLike): string[] {
    return seq instanceof StringBuilder ? seq.#chars : stringify(seq).split('');
  }

  /**
   * Appends a string of characters to the sequence.
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
   * - _N_: character count of the sequence
   */
  public toString(): string {
    return this.#chars.join('');
  }
}
