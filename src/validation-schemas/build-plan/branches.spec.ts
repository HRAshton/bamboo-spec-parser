import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { createSchemaAsserter } from '../../helpers/test-helpers.ts';
import { BranchesValidationSchema } from './branches.ts';

describe('BranchesValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      - {}
      -
        create: for-new-branch
      -
        delete:
          'after-deleted-days': 7
      -
        integration:
          'merge-from': 'develop'
      -
        'link-to-jira': true
      -
        create: for-pull-request
        delete:
          'after-inactive-days': 5
        integration:
          'merge-from': 'main'
          'push-on-success': true
        'link-to-jira': false
    `).toJS();

    it.each(testCases)('%s', createSchemaAsserter(BranchesValidationSchema));
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      -
        create: invalid
      -
        delete:
          'after-deleted-days': 0
      -
        integration:
          'push-on-success': true
      -
        'link-to-jira': 'yes'
    `).toJS();

    it.each(testCases)('%s', (testCase) => {
      expect(() => BranchesValidationSchema.parse(testCase)).toThrow();
    });
  });
});
