import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import { createSchemaAsserter } from '../../helpers/test-helpers.ts';
import { NotificationValidationSchema } from './notifications.ts';

describe('Notifications validation schema', () => {
  const testCases: unknown[] = parseDocument(`
      - recipients:
          - users:
              - admin
          - emails:
              - admin@example.com
        events:
          - plan-failed
          - job-error

      - recipients:
          - responsible
          - watchers
        events:
          - plan-failed: 3
          - job-error:
              first-only: false

      - recipients:
          - committers
        events:
          - plan-failed:
              failures: 2
          - plan-completed
          - plan-status-changed
          - plan-comment-added
          - plan-responsibility-changed
          - job-completed
          - job-status-changed
          - job-failed
          - job-first-failed
          - job-hung
          - job-queue-timeout
          - job-queued-without-capable-agents
    `).toJS();

  it.each(testCases)('%s', createSchemaAsserter(NotificationValidationSchema));
});
