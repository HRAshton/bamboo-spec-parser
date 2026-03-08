import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { StageValidationSchema } from './stages.ts';

describe('Build Plan Stages', () => {
  const testCases: unknown[] = parseDocument(`
    - Build Stage:
      - JOB1

    - Build Stage:
        manual: true
        final: false
        jobs:
          - JOB1
          - JOB2

    - Build Stage:
        jobs:
          - JOB1
  `).toJS();

  it.each(testCases)('%s', (testCase) => {
    const result = StageValidationSchema.parse(testCase);
    expect(result).toStrictEqual(testCase);
  });
});
