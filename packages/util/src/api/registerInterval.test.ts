import { registerInterval, sleep } from '.';

describe('registerInterval', () => {
  describe('runs interval enough times', () => {
    function testRunsEnoughTimes({
      duration,
      minProcessCount,
      alpha,
    }: {
      duration: number;
      minProcessCount: number;
      alpha: number;
    }): void {
      test(`with duration=${duration}, minProcessCount=${minProcessCount}, alpha=${alpha}`, async () => {
        let processCount = 0;

        const unregister = registerInterval(async () => {
          processCount++;
        }, duration);

        // Extend by `alpha` (percent) to make sure it runs at least the expected number of times
        const sleepDuration = Math.ceil(duration * minProcessCount * (1 + alpha));

        await sleep(sleepDuration);

        await unregister();

        expect(processCount).toBeGreaterThanOrEqual(minProcessCount);
      });
    }

    testRunsEnoughTimes({ duration: 10, minProcessCount: 5, alpha: 0.25 });
    testRunsEnoughTimes({ duration: 50, minProcessCount: 5, alpha: 0.25 });
    testRunsEnoughTimes({ duration: 100, minProcessCount: 5, alpha: 0.25 });

    testRunsEnoughTimes({ duration: 10, minProcessCount: 10, alpha: 0.25 });
    testRunsEnoughTimes({ duration: 50, minProcessCount: 10, alpha: 0.25 });
    testRunsEnoughTimes({ duration: 100, minProcessCount: 10, alpha: 0.25 });
  });

  test('does not run interval after unsubscribing', async () => {
    let processCount = 0;

    const unregister = registerInterval(async () => {
      processCount++;
    }, 10);

    await sleep(100);

    await unregister();
    const processCountFinal = processCount;

    await sleep(100);

    expect(processCount).toBe(processCountFinal);
  });
});
