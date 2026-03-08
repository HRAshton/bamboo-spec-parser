import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { VcsTagTaskValidationSchema } from './vcs-tag.ts';

describe('VcsTagTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseAndExtendTaskTestCases(`
      # tag with default repository only
      - vcs-tag:
          tag: release-\${bamboo.release.version}

      # tag with repository and working directory
      - vcs-tag:
          tag: release-\${bamboo.release.version}
          repository: my repository
          working-dir: src/
    `);

    it.each(testCases)('%s', createSchemaAsserter(VcsTagTaskValidationSchema));
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      - vcs-tag: 123

      - vcs-tag:
          repository: my repository

      - vcs-tag:
          tag: true

      - vcs-tag:
          tag: release
          repository: false

      - vcs-tag:
          tag: release
          working-dir: 99

      - vcs-tag:
          tag: release
          conditions: invalid
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(VcsTagTaskValidationSchema),
    );
  });
});
