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
   * @returns The dequeued item.
   *
   * @throws {@link NoSuchElementError}
   * Thrown if the queue is empty.
   */
  dequeue(): E;

  /**
   * Retrieves, but does not remove, the head of this queue i.e. then item that will be
   * removed if `dequeue()` is called.
   *
   * @returns The head element.
   *
   * @throws {@link NoSuchElementError}
   * Thrown if the queue is empty.
   */
  peek(): E;
}
