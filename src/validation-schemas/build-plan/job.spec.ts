import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { createSchemaAsserter } from '../../helpers/test-helpers.ts';
import { JobValidationSchema, OtherValidationSchema } from './job.ts';

describe('Job validation schema', () => {
  describe('Others validation', () => {
    it('should parse simple others', () => {
      const yaml = `
        clean-working-dir: true
      `;

      const parsed = parseDocument(yaml).toJS();
      const validated = OtherValidationSchema.parse(parsed);

      expect(validated).toStrictEqual(parsed);
    });

    it('should parse complex others', () => {
      const yaml = `
        clean-working-dir: true
        all-other-apps:
          custom:
            com.atlassian.bamboo.build.test.skip.history.enabled: 'true'
            auto:
              regex: '123'
              label: '123'
            buildHangingConfig:
              minutesBetweenLogs: '13'
              minutesQueueTimeout: '123'
              multiplier: '12'
              enabled: 'true'
            ncover:
              path: '123'
              exists: 'true'
            clover:
              path: '123'
              exists: 'true'
      `;

      const parsed = parseDocument(yaml).toJS();
      const validated = OtherValidationSchema.parse(parsed);

      expect(validated).toStrictEqual(parsed);
    });
  });

  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      - {}

      -
        key: JOB1

      -
        artifact-subscriptions:
          - artifact: my-artifact
            destination: /output

      -
        docker: 'openjdk:11'

      -
        key: JOB2
        artifact-subscriptions:
          - artifact: another-artifact
            destination: dist
        docker: 'busybox'
    `).toJS();

    it.each(testCases)('%s', createSchemaAsserter(JobValidationSchema));
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # wrong type for 'key' (should be a string)
      -
        key: 123

      # missing 'destination' in artifact-subscriptions entry
      -
        artifact-subscriptions:
          - artifact: missing-destination

      # missing 'artifact' in artifact-subscriptions entry
      -
        artifact-subscriptions:
          - destination: only-destination

      # wrong type for 'docker' (should be a string or object with image)
      -
        docker: 123

      # invalid artifacts entry: array contains non-object
      -
        artifacts:
          - 123

      # invalid other subfield type: clean-working-dir should be boolean
      -
        other:
          clean-working-dir: 'not-a-boolean'
    `).toJS();

    it.each(testCases)('%s', (testCase) => {
      expect(() => JobValidationSchema.parse(testCase)).toThrow();
    });
  });
});
