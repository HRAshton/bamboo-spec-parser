import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { InjectVariablesTaskValidationSchema } from './inject-variables.ts';

describe('InjectVariablesTaskValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases = parseAndExtendTaskTestCases(`
      - inject-variables:
          file: folder\\file.txt
          scope: RESULT
          namespace: myspace

      - inject-variables: tests.txt

      - inject-variables:
          file: folder\\file.txt
          scope: RESULT
          namespace: myspace
    `);

    it.each(testCases)(
      '%s',
      createSchemaAsserter(InjectVariablesTaskValidationSchema),
    );

    it('should normalize enum values to uppercase', () => {
      const testCase = {
        'inject-variables': {
          file: 'folder\\file.txt',
          scope: 'reSUlt',
        },
      };

      const expected = {
        'inject-variables': {
          file: 'folder\\file.txt',
          scope: 'RESULT',
        },
      };

      const parsed = InjectVariablesTaskValidationSchema.parse(testCase);
      expect(parsed).toStrictEqual(expected);
    });
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      # wrong task payload type
      - inject-variables: 123

      # required file missing in object mode
      - inject-variables:
          scope: RESULT

      # wrong file type
      - inject-variables:
          file: 123

      # invalid enum value
      - inject-variables:
          file: folder\\file.txt
          scope: GLOBAL

      # wrong namespace type
      - inject-variables:
          file: folder\\file.txt
          namespace: true

      # wrong conditions type
      - inject-variables:
          file: folder\\file.txt
          conditions: invalid

      # wrong description type
      - inject-variables:
          file: folder\\file.txt
          description: 42
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(InjectVariablesTaskValidationSchema),
    );
  });
});
