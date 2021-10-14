/**
 * Sleeps for a specified number of milliseconds.
 *
 * @param duration - Duration to sleep (in ms).
 * @returns A Promise that resolves after the specified duration.
 */
export function sleep(duration: number): Promise<void> {
  return new Promise((r) => setTimeout(r, duration));
}
