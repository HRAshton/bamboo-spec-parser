import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { VcsPushTaskValidationSchema } from './vcs-push.ts';

describe('VcsPushTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases = parseAndExtendTaskTestCases(`
      # push with default repository only
      - vcs-push
      
      # push with explicit repository
      - vcs-push:
          repository: asd
      
      # push with repository and working directory
      - vcs-push:
          repository: asd
          working-dir: src/
    `);

    it.each(testCases)('%s', createSchemaAsserter(VcsPushTaskValidationSchema));
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      - vcs-push: 123

      - vcs-push:
          working-dir: src/

      - vcs-push:
          repository: true

      - vcs-push:
          repository: asd
          working-dir: 12

      - vcs-push:
          repository: asd
          description: 42
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(VcsPushTaskValidationSchema),
    );
  });
});
