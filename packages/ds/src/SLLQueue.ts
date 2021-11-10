import type { Queue } from './api';
import { AbstractCollection } from './internal/AbstractCollection';

class SLLNode<E> {
  public next: SLLNode<E> | null;

  public constructor(public readonly data: E) {
    this.next = null;
  }
}

/**
 * A FIFO queue implemented with a singly-linked list. Items are enqueued from the top and
 * dequeued from the bottom.
 */
export class SLLQueue<E> extends AbstractCollection<E> implements Queue<E> {
  #top: SLLNode<E> | null;
  #bottom: SLLNode<E> | null;
  #count: number;

  public get count(): number {
    return this.#count;
  }

  public constructor() {
    super();
    this.#top = null;
    this.#bottom = null;
    this.#count = 0;
  }

  public *[Symbol.iterator](): Iterator<E> {
    let cur = this.#bottom;

    while (cur !== null) {
      const curElement = cur;
      cur = cur.next;
      yield curElement.data;
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
  public clear(): void {
    this.#top = null;
    this.#bottom = null;
    this.#count = 0;
  }

  /**
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   */
  public enqueue(element: E): void {
    const newNode = new SLLNode(element);
    if (this.isEmpty) {
      this.#top = newNode;
      this.#bottom = newNode;
    } else {
      this.#assertNode(this.#top);
      this.#top.next = newNode;
      this.#top = this.#top.next;
    }
    this.#count++;
  }

  /**
   * @remarks
   *
   * **Complexity**:
   *
   * - Time complexity: _O_(1)
   * - Space complexity: _O_(1)
   */
  public dequeue(): E {
    this.#validateQueueIsNotEmpty();
    this.#assertNode(this.#bottom);
    const bottomElement = this.#bottom.data;
    this.#bottom = this.#bottom.next;
    this.#count--;
    return bottomElement;
  }

  #assertNode(node: SLLNode<E> | null): asserts node {
    if (node === null) {
      this.throwImplementationError();
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
  public peek(): E {
    this.#validateQueueIsNotEmpty();
    this.#assertNode(this.#bottom);
    return this.#bottom.data;
  }

  #validateQueueIsNotEmpty(): void {
    if (this.isEmpty) {
      this.throwEmptyCollectionError();
    }
  }
}
