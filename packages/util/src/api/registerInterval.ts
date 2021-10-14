import { sleep } from './sleep';

/**
 * Registers an async callback that keeps running in the background until it is unregistered. Waits for the
 * callback Promise to resolve and sleeps for an additional `duration` ms and invokes the callback again.
 *
 * @param callback - An asynchronous function that will keep running in the background.
 * @param duration - The amount of time (in ms) to sleep after the callback Promise resolves before invoking
 * the callback again.
 * @returns A an asynchronous function that unregisters the callback. The function returns a Promise that resolves
 * when the very last interval finishes processing.
 */
export function registerInterval(
  callback: () => void | Promise<void>,
  duration: number
): () => Promise<void>;

/**
 * Registers an async callback that keeps running in the background until it is unregistered. Waits for the
 * callback Promise to resolve and sleeps for an additional `duration` ms and invokes the callback again.
 *
 * @param callback - An asynchronous function that will keep running in the background.
 * @param getDuration - A function that returns the amount of time (in ms) to sleep after the callback Promise
 * resolves before invoking the callback again.
 * @returns A an asynchronous function that unregisters the callback. The function returns a Promise that resolves
 * when the very last interval finishes processing.
 */
export function registerInterval(
  callback: () => void | Promise<void>,
  getDuration: () => number
): () => Promise<void>;

export function registerInterval(
  callback: () => void | Promise<void>,
  durationOrGetDuration: number | (() => number)
): () => Promise<void> {
  let shouldRun = true;

  const promise = (async () => {
    while (shouldRun) {
      await callback();
      const duration =
        typeof durationOrGetDuration === 'number' ? durationOrGetDuration : durationOrGetDuration();
      await sleep(duration);
    }
  })();

  return async () => {
    shouldRun = false;
    await promise;
  };
}
