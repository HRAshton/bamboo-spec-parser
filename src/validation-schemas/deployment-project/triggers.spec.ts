import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { DeploymentEnvironmentTriggerValidationSchema } from './triggers.ts';

describe('Triggers Validation', () => {
  const testCases: unknown[] = parseDocument(`
    - build-success
    - build-success:
        branch: stage-ready-branch

    - stage-success: Test
    - stage-success:
        stage: Space stage
    - stage-success:
        stage: Integration tests
        branch: integration-branch

    - environment-success: Staging
    - environment-success:
        environment: qwe

    - cron: 0 0 0 ? * *
    - cron:
        expression: 0 0 0 ? * *
    - cron:
        expression: 0 0 0 ? * *
        artifact-branch: your-artifact-branch
        skip-if-version-deployed: true
    `).toJS();

  it.each(testCases)('%s', (testCase) => {
    const result = DeploymentEnvironmentTriggerValidationSchema.parse(testCase);
    expect(result).toStrictEqual(testCase);
  });
});
