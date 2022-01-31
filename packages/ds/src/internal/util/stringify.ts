import type { CharSequenceLike } from '..';

export function stringify(seq: CharSequenceLike): string {
  switch (typeof seq) {
    case 'string':
      return seq;
    case 'number':
      return seq.toString();
    case 'undefined':
    case 'boolean':
      return `${seq}`;
    case 'object':
      return seq === null ? 'null' : seq.toString();
  }
}
