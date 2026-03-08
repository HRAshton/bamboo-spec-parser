import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { VcsBranchTaskValidationSchema } from './vcs-branch.ts';

describe('VcsBranchTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseAndExtendTaskTestCases(`
      # branch with default repository only
      - vcs-branch:
          branch: feature-branch

      # branch with explicit repository
      - vcs-branch:
          branch: develop
          repository: my-repo
    `);

    it.each(testCases)(
      '%s',
      createSchemaAsserter(VcsBranchTaskValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      - vcs-branch: 123

      - vcs-branch:
          repository: my-repo

      - vcs-branch:
          branch: 123

      - vcs-branch:
          branch: feature
          repository: false

      - vcs-branch:
          branch: feature
          conditions: invalid
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(VcsBranchTaskValidationSchema),
    );
  });
});
