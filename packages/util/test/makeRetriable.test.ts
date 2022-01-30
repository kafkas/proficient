import { makeRetriable } from '../src';
import { RetriableResult } from '../src/api/makeRetriable';

/* eslint-disable @typescript-eslint/explicit-function-return-type */

describe('makeRetriable', () => {
  async function doSomethingThatAlwaysFails() {
    throw Error();
  }

  describe('does not succeed with a failing function', () => {
    function testWithMaxTrialCountSetTo(n: number) {
      test(`with \`maxTrialCount\` set to ${n}`, async () => {
        const retriable = makeRetriable(doSomethingThatAlwaysFails, {
          maxTrialCount: n,
          sleepTimeBetweenTrials: 0,
          returnErrors: false,
        });
        const res = await retriable();

        expect(res.hasSucceeded).toBe(false);
      });
    }

    testWithMaxTrialCountSetTo(3);
    testWithMaxTrialCountSetTo(9);
    testWithMaxTrialCountSetTo(27);
  });

  describe(`with a function that succeeds every nth time`, () => {
    type TestConfig = {
      maxTrialCount: number;
      n: number;
    };

    type TestConfigWithValue<T> = TestConfig & {
      value: T;
    };

    function withArbitraryValues(configs: TestConfig[]) {
      return configs.map((c, idx) => {
        const value = (() => {
          switch (idx % configs.length) {
            case 0:
              return null;
            case 1:
              return 123;
            case 2:
              return 'abc';
            case 3:
              return [null];
            case 4:
              return { someField: 'abc' };
            default:
              return undefined;
          }
        })();

        return { ...c, value };
      });
    }

    function makePeriodicallySucceedingFunction<T>(n: number, returnedValue: T) {
      let i = 1;
      return async () => {
        if (i % n === 0) {
          i = 1;
          return returnedValue;
        } else {
          i++;
          throw Error();
        }
      };
    }

    function testWith<T>(
      c: TestConfig | TestConfigWithValue<T>,
      cb: (res: RetriableResult<T | undefined>) => void
    ) {
      let name = `maxTrialCount=${c.maxTrialCount}, n=${c.n}`;
      name += 'value' in c ? `, value=${c.value}` : '';
      test(name, async () => {
        const doSthThatSucceedsEveryNthTime = makePeriodicallySucceedingFunction(
          c.n,
          'value' in c ? c.value : undefined
        );
        const retriable = makeRetriable(doSthThatSucceedsEveryNthTime, {
          maxTrialCount: c.maxTrialCount,
          sleepTimeBetweenTrials: 0,
          returnErrors: true,
        });
        const res = await retriable();
        cb(res);
      });
    }

    describe(`succeeds on nth trial if \`maxTrialCount\` >= n`, () => {
      function expectSucceeds({ maxTrialCount, n }: TestConfig) {
        testWith({ maxTrialCount, n }, (res) => {
          expect(res.hasSucceeded).toBe(true);
        });
      }

      expectSucceeds({ maxTrialCount: 1, n: 1 });
      expectSucceeds({ maxTrialCount: 2, n: 1 });
      expectSucceeds({ maxTrialCount: 5, n: 2 });
      expectSucceeds({ maxTrialCount: 10, n: 5 });
      expectSucceeds({ maxTrialCount: 10, n: 10 });
    });

    describe(`fails if \`maxTrialCount\` < n`, () => {
      function expectFails({ maxTrialCount, n }: TestConfig) {
        testWith({ maxTrialCount, n }, (res) => {
          expect(res.hasSucceeded).toBe(false);
        });
      }

      expectFails({ maxTrialCount: 1, n: 2 });
      expectFails({ maxTrialCount: 2, n: 4 });
      expectFails({ maxTrialCount: 3, n: 7 });
      expectFails({ maxTrialCount: 4, n: 8 });
      expectFails({ maxTrialCount: 9, n: 10 });
    });

    describe('if succeeds', () => {
      const succeedingConfigs: TestConfig[] = [
        { maxTrialCount: 1, n: 1 },
        { maxTrialCount: 3, n: 2 },
        { maxTrialCount: 4, n: 3 },
        { maxTrialCount: 5, n: 4 },
        { maxTrialCount: 6, n: 5 },
      ];

      describe(`result.trialCount == n`, () => {
        function expectCorrectTrialCount({ maxTrialCount, n }: TestConfig) {
          testWith({ maxTrialCount, n }, (res) => {
            expect(res.trialCount).toBe(n);
          });
        }

        succeedingConfigs.forEach((c) => {
          expectCorrectTrialCount(c);
        });
      });

      describe(`result.value == awaited value returned by original func `, () => {
        function expectCorrectValue<T>({ maxTrialCount, n, value }: TestConfigWithValue<T>) {
          testWith({ maxTrialCount, n, value }, (res) => {
            if (res.hasSucceeded) {
              expect(res.value).toBe(value);
            }
          });
        }

        withArbitraryValues(succeedingConfigs).forEach((c) => {
          expectCorrectValue(c);
        });
      });

      describe(`result.errors.length == result.trialCount - 1`, () => {
        function expectCorrectErrorCount({ maxTrialCount, n }: TestConfig) {
          testWith({ maxTrialCount, n }, (res) => {
            expect(res.errors.length).toEqual(res.trialCount - 1);
          });
        }

        succeedingConfigs.forEach((c) => {
          expectCorrectErrorCount(c);
        });
      });
    });

    describe('if fails', () => {
      const failingConfigs: TestConfig[] = [
        { maxTrialCount: 1, n: 2 },
        { maxTrialCount: 2, n: 3 },
        { maxTrialCount: 3, n: 4 },
        { maxTrialCount: 4, n: 5 },
        { maxTrialCount: 5, n: 6 },
      ];

      describe(`result.trialCount == maxTrialCount`, () => {
        function expectCorrectTrialCount({ maxTrialCount, n }: TestConfig): void {
          testWith({ maxTrialCount, n }, (res) => {
            expect(res.trialCount).toBe(maxTrialCount);
          });
        }

        failingConfigs.forEach((c) => {
          expectCorrectTrialCount(c);
        });
      });

      describe(`result does not contain \`value\``, () => {
        function expectNoValue<T>({ maxTrialCount, n, value }: TestConfigWithValue<T>) {
          testWith({ maxTrialCount, n, value }, (res) => {
            expect('value' in res).toBe(false);
          });
        }

        withArbitraryValues(failingConfigs).forEach((c) => {
          expectNoValue(c);
        });
      });

      describe(`result.errors.length == result.trialCount`, () => {
        function expectCorrectErrorCount({ maxTrialCount, n }: TestConfig) {
          testWith({ maxTrialCount, n }, (res) => {
            expect(res.errors.length).toEqual(res.trialCount);
          });
        }

        failingConfigs.forEach((c) => {
          expectCorrectErrorCount(c);
        });
      });
    });
  });
});
