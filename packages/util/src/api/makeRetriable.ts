import { sleep } from '.';

/**
 * The configuration with which the retriable version of a function is created.
 */
export interface RetryConfig {
  /**
   * Must be a positive integer indicating the maximum number of times the original function can be
   * invoked.
   */
  maxTrialCount: number;

  /**
   * Must be a non-negative integer or a function that takes the 0-based index of the last trial and
   * returns a non-negative integer indicating the amount of time (in ms) to "sleep" before the next
   * invocation. This is useful if you want to implement something like exponential backoff.
   */
  sleepTimeBetweenTrials: number | ((lastTrialIndex: number) => number);

  /**
   * Whether to return errors in the response. If set to false, the returned `errors` will be
   * an empty array.
   */
  returnErrors: boolean;
}

export type RetriableResult<T> = {
  trialCount: number;
  errors: unknown[];
} & (
  | {
      hasSucceeded: true;
      /**
       * The (awaited) value returned by the original function.
       */
      value: Awaited<T>;
    }
  | {
      hasSucceeded: false;
    }
);

/**
 * A type representing the retriable version of a given function.
 */
export type RetriableVersionOf<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => Promise<RetriableResult<ReturnType<F>>>;

/**
 * Creates a retriable version of a given function, which, when invoked, is continuously retried according
 * to the specified retry config until it succeeds. The new function returns a Promise that resolves when
 * the original function succeeds or `maxTrialCount` is reached.
 *
 * @param originalFunc - A function whose retriable version to create.
 * @param retryConfig - The configuration with which the retriable version of the original function will be created.
 * @returns A an asynchronous function that returns a Promise resolving to an object containing the details of the
 * retry process including a boolean indicating whether it has succeeded or not. This newly created function does
 * not throw.
 */
export function makeRetriable<F extends (...args: any[]) => any>(
  originalFunc: F,
  retryConfig: RetryConfig
): RetriableVersionOf<F> {
  return async (...args) => {
    const { maxTrialCount, sleepTimeBetweenTrials, returnErrors } = retryConfig;

    let trialCount = 0;
    const errors: unknown[] = [];

    while (true) {
      try {
        const value = await originalFunc(...args);
        trialCount++;
        return { hasSucceeded: true, trialCount, errors, value };
      } catch (err) {
        trialCount++;
        if (returnErrors) {
          errors.push(err);
        }
        if (trialCount >= maxTrialCount) {
          return { hasSucceeded: false, trialCount, errors };
        }
        const sleepTime =
          typeof sleepTimeBetweenTrials === 'number'
            ? sleepTimeBetweenTrials
            : sleepTimeBetweenTrials(trialCount - 1);
        await sleep(sleepTime);
      }
    }
  };
}
