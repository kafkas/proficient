import type { CharSequenceLike } from '../src/types';
import { StringBuilder } from '../src/classes/StringBuilder';

/* eslint-disable @typescript-eslint/explicit-function-return-type */

describe('StringBuilder', () => {
  describe('on initialization', () => {
    describe('with no arguments', () => {
      test('count is 0', () => {
        const sb = new StringBuilder();
        expect(sb.count).toBe(0);
      });
    });

    describe('with initial sequence argument', () => {
      describe('count equals initial sequence length', () => {
        function expectCorrectCount(str: string) {
          test(`"${str}"`, () => {
            const sb = new StringBuilder(str);
            expect(sb.count).toBe(str.length);
          });
        }

        expectCorrectCount('');
        expectCorrectCount('a');
        expectCorrectCount('abc');
      });
    });
  });

  describe('on new sequences appended', () => {
    function testWith(sequences: CharSequenceLike[], cb: (sb: StringBuilder) => void) {
      const name = sequences.map((seq) => `"${seq}"`).join(' + ');
      test(name, () => {
        const sb = new StringBuilder();
        sequences.forEach((seq) => {
          sb.append(seq);
        });
        cb(sb);
      });
    }

    describe('shows correct count', () => {
      function expectCorrectCount(sequences: CharSequenceLike[], expectedCount: number) {
        testWith(sequences, (sb) => {
          expect(sb.count).toEqual(expectedCount);
        });
      }

      expectCorrectCount([''], 0);
      expectCorrectCount(['', ''], 0);
      expectCorrectCount([undefined, '', 'a'], 10);
      expectCorrectCount(['', 'a', 'b', null], 6);
      expectCorrectCount(['', 'ab', 12, new StringBuilder(), 'c'], 5);
      expectCorrectCount(['abc', 3.4, 'de', false, 'f', '', new StringBuilder('g')], 15);
      expectCorrectCount(['abc', '', true, 'de', ' ', 'f', new StringBuilder('gh'), ' '], 14);
    });
  });

  describe('on new sequences inserted', () => {
    describe('builds to the correct string', () => {
      function testWith(
        initialSeq: string,
        insertOps: [index: number, seq: CharSequenceLike][],
        cb: (sb: StringBuilder) => void
      ) {
        const sb = new StringBuilder(initialSeq);
        const name = insertOps
          .map(([index, seq]) => `sb = "${sb.toString()}": insert "${seq}" at index ${index}"`)
          .join(' + ');
        test(name, () => {
          insertOps.forEach(([index, seq]) => {
            sb.insert(index, seq);
          });
          cb(sb);
        });
      }

      function expectCorrectString(
        initialSeq: string,
        insertOps: [index: number, seq: CharSequenceLike][],
        expectedString: string
      ) {
        testWith(initialSeq, insertOps, (sb) => {
          expect(sb.toString()).toEqual(expectedString);
        });
      }

      expectCorrectString('', [[0, '']], '');
      expectCorrectString('a', [[0, '']], 'a');
      expectCorrectString('a', [[0, 'b']], 'ba');
      expectCorrectString('apple', [[1, 'b']], 'abpple');
      expectCorrectString(
        'apple',
        [
          [1, 'b'],
          [1, 'cd'],
        ],
        'acdbpple'
      );
      expectCorrectString(
        'apple',
        [
          [1, 'bb'],
          [1, 'cc'],
          [1, 'dd'],
        ],
        'addccbbpple'
      );
    });
  });

  describe('random', () => {
    // TODO: Clean this up
    test('random tests', () => {
      let sb = new StringBuilder();
      expect(sb.toString()).toBe('');
      expect(() => sb.insert(1, 'a')).toThrow();
      expect(() => sb.insert(2, 'ab')).toThrow();
      expect(() => sb.insert(0, 'a')).not.toThrow();

      expect(sb.toString()).toBe('a');

      expect(() => sb.insert(1, 'b')).not.toThrow();
      expect(() => sb.insert(3, 'c')).toThrow();

      expect(sb.toString()).toBe('ab');

      expect(() => sb.deleteCharAt(0)).not.toThrow();
      expect(() => sb.deleteCharAt(0)).not.toThrow();
      expect(() => sb.deleteCharAt(0)).toThrow();

      expect(sb.count).toBe(0);

      sb.append('abcde');
      sb.delete(2, 10);

      expect(sb.toString()).toBe('ab');

      sb = new StringBuilder('ab');
      expect(sb.insert(2, 'cd'));
      expect(sb.insert(4, 'ef'));
      expect(sb.toString()).toBe('abcdef');
      expect(() => sb.insert(7, 'gh')).toThrow();
    });
  });
});
