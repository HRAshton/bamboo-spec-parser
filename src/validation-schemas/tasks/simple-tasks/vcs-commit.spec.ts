import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { VcsCommitTaskValidationSchema } from './vcs-commit.ts';

describe('VcsCommitTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseAndExtendTaskTestCases(`
      # commit with default repository only
      - vcs-commit:
          message: Configuration changes - Bamboo build \${bamboo.buildResultKey}

      # commit with explicit repository
      - vcs-commit:
          repository: asd
          message: asd
    `);

    it.each(testCases)(
      '%s',
      createSchemaAsserter(VcsCommitTaskValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      - vcs-commit: 123

      - vcs-commit:
          repository: asd

      - vcs-commit:
          message: true

      - vcs-commit:
          repository: 123
          message: asd

      - vcs-commit:
          message: asd
          conditions: invalid
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(VcsCommitTaskValidationSchema),
    );
  });
});
