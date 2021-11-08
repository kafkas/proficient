import { SLLQueue } from '../src';
import { EmptyCollectionError } from './internal/EmptyCollectionError';

describe('SLLQueue', () => {
  describe('on initialization', () => {
    test('is empty', () => {
      const q = new SLLQueue<number>();
      expect(q.isEmpty).toBe(true);
    });
  });

  describe('when empty', () => {
    test('count is 0', () => {
      const q = new SLLQueue<number>();
      expect(q.count).toBe(0);
    });

    test('throws EmptyCollectionError when dequeued', () => {
      const q = new SLLQueue<number>();
      expect(() => q.dequeue()).toThrow(EmptyCollectionError);
    });

    test('throws EmptyCollectionError when peeked', () => {
      const q = new SLLQueue<number>();
      expect(() => q.peek()).toThrow(EmptyCollectionError);
    });

    test('converts to empty array', () => {
      const q = new SLLQueue<number>();
      expect(q.toArray().length).toBe(0);
    });

    test('iteration yields no items', () => {
      const q = new SLLQueue<number>();
      const iteratedItems: number[] = [];
      for (const elem of q) {
        iteratedItems.push(elem);
      }
      expect(iteratedItems.length).toBe(0);
    });
  });

  describe('on new items enqueued', () => {
    test('is not empty', () => {
      const q = new SLLQueue<string>();
      q.enqueue('a');
      expect(q.isEmpty).toBe(false);
    });

    test('shows correct count', () => {
      const q = new SLLQueue<string>();
      q.enqueue('a');
      q.enqueue('b');
      expect(q.count).toBe(2);
    });

    test('can be iterated in FIFO order', () => {
      const q = new SLLQueue<number>();
      const queueItems = [1, 2, 3, 4];
      queueItems.forEach((item) => {
        q.enqueue(item);
      });
      const iteratedItems: number[] = [];
      for (const elem of q) {
        iteratedItems.push(elem);
      }
      expect(iteratedItems).toEqual(queueItems);
    });

    test('converts to plain array in FIFO order', () => {
      const q = new SLLQueue<number>();
      const queueItems = [1, 2, 3, 4];
      queueItems.forEach((item) => {
        q.enqueue(item);
      });
      expect(q.toArray()).toEqual(queueItems);
    });

    test('does not throw when peeked', () => {
      const q = new SLLQueue<number>();
      q.enqueue(1);
      expect(() => q.peek()).not.toThrow();
    });

    test('does not throw when dequeued', () => {
      const q = new SLLQueue<number>();
      q.enqueue(1);
      expect(() => q.dequeue()).not.toThrow();
    });
  });

  describe('on items dequeued', () => {
    test('is empty if all dequeued', () => {
      const q = new SLLQueue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.dequeue();
      q.dequeue();
      expect(q.isEmpty).toBe(true);
    });

    test('shows correct count', () => {
      const q = new SLLQueue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.dequeue();
      expect(q.count).toBe(1);
    });

    test('respects FIFO order', () => {
      const q = new SLLQueue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.enqueue(3);

      expect(q.dequeue()).toBe(1);
      expect(q.dequeue()).toBe(2);

      q.enqueue(4);
      q.enqueue(5);

      expect(q.dequeue()).toBe(3);
      expect(q.dequeue()).toBe(4);
      expect(q.dequeue()).toBe(5);
    });
  });

  describe('on items peeked', () => {
    test('does not change count', () => {
      const q = new SLLQueue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.peek();
      expect(q.count).toBe(2);
    });

    test('respects FIFO order', () => {
      const q = new SLLQueue<number>();
      q.enqueue(1);
      q.enqueue(2);
      q.enqueue(3);
      expect(q.peek()).toBe(1);
    });
  });
});
