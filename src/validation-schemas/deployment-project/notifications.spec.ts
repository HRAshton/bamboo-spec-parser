import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { DeploymentNotificationValidationSchema } from './notifications.ts';

describe('Notifications Validation', () => {
  const testCases: unknown[] = parseDocument(`
      - events:
          - deployment-failed
        recipients:
          - webhook:
              name: Build webhook
              url: https://example.com
          - webhook:
              name: Deploy webhook
              url: https://example.com

      - events:
          - deployment-finished
        recipients:
          - users:
              - bamboo

      - events:
          - deployment-started-and-finished
        recipients:
          - emails:
              - asd@asd.ru
          - groups:
              - bamboo-admin
          - users:
              - bamboo
      `).toJS();

  it.each(testCases)('%s', (testCase) => {
    const result = DeploymentNotificationValidationSchema.parse(testCase);
    expect(result).toStrictEqual(testCase);
  });
});
