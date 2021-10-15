import type { Collection } from './Collection';

export interface Queue<E> extends Collection<E> {
  /**
   * Pushes an item to the queue.
   *
   * @param element - The new element to enqueue.
   */
  enqueue(element: E): void;

  /**
   * Removes an item from the queue.
   *
   * @throws If the queue is empty. TODO
   *
   * @returns The dequeued item.
   */
  dequeue(): E;

  /**
   * Retrieves, but does not remove, the head of this queue.
   *
   * @throws If the queue is empty. TODO
   *
   * @returns The head element of the queue.
   */
  peek(): E;
}
