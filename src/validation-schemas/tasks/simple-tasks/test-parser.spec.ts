import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { TestParserTaskValidationSchema } from './test-parser.ts';

describe('TestParserTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases = parseAndExtendTaskTestCases(`
      - test-parser: junit

      - test-parser:
          type: mocha
          test-results:
            - mocha-1.json
            - mocha-2.json

      - test-parser:
          type: junit
          test-results:
            - build/test/reports
            - target/test/xml-reports

      # scalar form for test-results is allowed by schema
      - test-parser:
          type: junit
          test-results: '**/test-reports/*.xml'

      - test-parser:
          type: testng
          ignore-time: true

      - test-parser:
          type: mocha

      - test-parser:
          type: nunit

      - test-parser:
          type: mstest
    `);

    it.each(testCases)(
      '%s',
      createSchemaAsserter(TestParserTaskValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      - test-parser: 123

      - test-parser:
          type: xunit

      - test-parser:
          type: junit
          ignore-time: 'true'

      - test-parser:
          type: junit
          test-results: 123

      - test-parser:
          type: junit
          test-results:
            - valid.xml
            - 123

      - test-parser:
          type: true
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(TestParserTaskValidationSchema),
    );
  });
});
