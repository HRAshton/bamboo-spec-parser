import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { ArtifactValidationSchema } from './artifacts.ts';

describe('Artifact validation schema', () => {
  describe('Positive tests', () => {
    const positiveCases: unknown[] = parseDocument(`
      - name: my-artifact
        pattern: dist/**/*.jar

      - name: my-artifact
        pattern: dist/**/*.jar
        location: build/libs
        required: true
        shared: false
    `).toJS();

    it.each(positiveCases)('%s', (testCase) => {
      const result = ArtifactValidationSchema.parse(testCase);
      expect(result).toStrictEqual(testCase);
    });
  });

  describe('Negative tests', () => {
    const negativeCases: unknown[] = parseDocument(`
      - location: build/libs

      - name: 123
        pattern: true
        required: not-a-boolean
    `).toJS();

    it.each(negativeCases)('%s', (testCase) => {
      expect(() => ArtifactValidationSchema.parse(testCase)).toThrow();
    });
  });
});
