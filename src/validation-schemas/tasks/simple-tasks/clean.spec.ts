import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { CleanTaskValidationSchema } from './clean.ts';

describe('CleanTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseAndExtendTaskTestCases(`
      - clean

      - clean: {}
    `);

    it.each(testCases)('%s', createSchemaAsserter(CleanTaskValidationSchema));
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      # wrong scalar type
      - clean: 123

      # wrong object field type
      - clean:
          description: true

      # wrong conditions type
      - clean:
          conditions: invalid
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(CleanTaskValidationSchema),
    );
  });
});
