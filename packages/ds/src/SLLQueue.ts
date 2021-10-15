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
  #itemCount: number;

  public get size(): number {
    return this.#itemCount;
  }

  public constructor() {
    super();
    this.#top = null;
    this.#bottom = null;
    this.#itemCount = 0;
  }

  public *[Symbol.iterator](): Iterator<E> {
    let cur = this.#top;

    while (cur !== null) {
      const curElement = cur;
      cur = cur.next;
      yield curElement.data;
    }
  }

  public clear(): void {
    this.#top = null;
    this.#bottom = null;
    this.#itemCount = 0;
  }

  public enqueue(element: E): void {
    const newNode = new SLLNode(element);
    if (this.isEmpty) {
      this.#top = newNode;
      this.#bottom = newNode;
    } else {
      this.assertNode(this.#top);
      this.#top.next = newNode;
      this.#top = this.#top.next;
    }
    this.#itemCount++;
  }

  public dequeue(): E {
    this.validateNonEmptyQueue();
    this.assertNode(this.#bottom);
    const bottomElement = this.#bottom.data;
    this.#bottom = this.#bottom.next;
    this.#itemCount--;
    return bottomElement;
  }

  private assertNode(node: SLLNode<E> | null): asserts node {
    if (node === null) {
      this.throwImplementationError();
    }
  }

  public peek(): E {
    this.validateNonEmptyQueue();
    this.assertNode(this.#bottom);
    return this.#bottom.data;
  }

  private validateNonEmptyQueue(): void {
    if (this.isEmpty) {
      this.throwEmptyCollectionError();
    }
  }
}
