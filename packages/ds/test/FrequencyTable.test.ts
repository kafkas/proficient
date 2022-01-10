import { FrequencyTable } from '../src';

describe('FrequencyTable', () => {
  function createFrequencyTable<K extends string | number>(
    tuples: [K, number][]
  ): FrequencyTable<K> {
    const ft = new FrequencyTable<K>();
    tuples.forEach(([key, freq]) => {
      for (let i = 1; i <= freq; i++) {
        ft.increment(key);
      }
    });
    return ft;
  }

  describe('on initialization', () => {
    test('is empty', () => {
      const ft = new FrequencyTable();
      expect(ft.isEmpty).toBe(true);
    });
  });

  describe('when empty', () => {
    test('count is 0', () => {
      const ft = new FrequencyTable();
      expect(ft.count).toBe(0);
    });

    test('converts to empty array', () => {
      const ft = new FrequencyTable();
      expect(ft.toArray().length).toBe(0);
    });

    test('iteration yields no items', () => {
      const ft = new FrequencyTable<number>();
      const iteratedItems: [number, number][] = [];
      for (const elem of ft) {
        iteratedItems.push(elem);
      }
      expect(iteratedItems.length).toBe(0);
    });
  });

  describe('on new keys incremented', () => {
    test('is not empty', () => {
      const ft = new FrequencyTable<string>();
      ft.increment('a');
      expect(ft.isEmpty).toBe(false);
    });

    test('shows correct total', () => {
      const ft = new FrequencyTable<string>();
      ft.increment('a');
      ft.increment('a');
      ft.increment('b');
      expect(ft.total).toBe(3);
    });

    test('shows correct count', () => {
      const ft = new FrequencyTable<string>();
      ft.increment('a');
      ft.increment('a');
      ft.increment('b');
      expect(ft.count).toBe(2);
    });

    test('shows correct key frequency', () => {
      const ft = new FrequencyTable<string>();
      ft.increment('a');
      ft.increment('a');
      ft.increment('b');
      expect(ft.frequencyOf('a')).toBe(2);
    });

    test('can be iterated', () => {
      const tuples: [string, number][] = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ];
      const ft = createFrequencyTable(tuples);
      const iteratedItems: [string, number][] = [];
      for (const tuple of ft) {
        iteratedItems.push(tuple);
      }
      expect(new Set(iteratedItems)).toEqual(new Set(tuples)); // TODO: Double check
    });

    test('converts to plain array', () => {
      const tuples: [string, number][] = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ];
      const ft = createFrequencyTable(tuples);
      expect(new Set(ft.toArray())).toEqual(new Set(tuples));
    });
  });

  describe('on keys decremented', () => {
    test('is empty if all decremented', () => {
      const tuples: [string, number][] = [
        ['a', 1],
        ['b', 2],
      ];
      const ft = createFrequencyTable(tuples);
      ft.decrement('a');
      ft.decrement('b');
      ft.decrement('b');
      expect(ft.isEmpty).toBe(true);
    });

    test('shows correct total', () => {
      const tuples: [string, number][] = [
        ['a', 4],
        ['b', 6],
      ];
      const ft = createFrequencyTable(tuples);
      ft.decrement('a');
      ft.decrement('a');
      ft.decrement('b');
      expect(ft.total).toBe(7);
    });

    test('shows correct count', () => {
      const tuples: [string, number][] = [
        ['a', 3],
        ['b', 2],
        ['c', 1],
      ];
      const ft = createFrequencyTable(tuples);
      ft.decrement('c');
      ft.decrement('b');
      ft.decrement('b');
      expect(ft.count).toBe(1);
    });

    test('shows correct key frequency', () => {
      const tuples: [string, number][] = [
        ['a', 5],
        ['b', 6],
        ['c', 7],
      ];
      const ft = createFrequencyTable(tuples);
      ft.decrement('b');
      ft.decrement('b');
      expect(ft.frequencyOf('b')).toBe(4);
    });
  });

  describe('on items cleared', () => {
    test('is empty', () => {
      const tuples: [string, number][] = [
        ['a', 2],
        ['b', 1],
      ];
      const ft = createFrequencyTable(tuples);
      ft.clear();
      expect(ft.isEmpty).toBe(true);
    });
  });
});
