import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { TriggerValidationSchema } from './triggers.ts';

describe('Triggers Validation', () => {
  const testCases: unknown[] = parseDocument(`
    - polling: 130
    - polling:
        period: 150
    - polling:
        cron: 0 0/30 9-19 ? * MON-FRI
        repositories:
          - bitbucket-cloud
        conditions:
          - green-plan:
              - PROJECTKEY-PLANKEY
          - all-other-conditions:
              custom.rejectBranchBuildWithoutChange.enabled: true

    - cron: 0 * * * ? *
    - cron:
        expression: 0 0 * * ? *

    - remote
    - remote: 192.168.0.1
    - remote:
        ip: 192.168.0.2
    `).toJS();

  it.each(testCases)('should validate trigger configuration %s', (testCase) => {
    const result = TriggerValidationSchema.parse(testCase);
    expect(result).toStrictEqual(testCase);
  });
});
