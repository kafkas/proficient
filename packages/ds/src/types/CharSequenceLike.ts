import type { StringBuilder } from '../classes';

/**
 * A value that can be represented as a sequence of characters. A {@link CharSequenceLike}
 * value can be easily converted to a string or used in {@link StringBuilder} operations.
 */
export type CharSequenceLike = string | number | boolean | null | undefined | StringBuilder;
