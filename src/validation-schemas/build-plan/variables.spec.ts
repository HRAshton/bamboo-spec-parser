import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
} from '../../helpers/test-helpers.ts';
import { VariablesValidationSchema } from './variables.ts';

describe('VariablesValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      # simple string variables
      - username: admin
        releaseType: milestone

      # single variable
      - env: production

      # multiple variables with various names
      - maven.goal: clean install -DskipTests
        build.number: \${bamboo.buildNumber}
        docker.image: node:14

      # encrypted password variable (BAMSCRT format)
      - password: BAMSCRT@0@0@r7STxYwtyNCz123WWXKq8g==

      # variables with special characters in values
      - url: https://example.com:8080/path?query=value
        command: echo 'Hello world'
        
      # empty variable value
      - empty: ''
        
      # numeric string value
      - port: '8080'
        version: '1.0.0'
    `).toJS();

    it.each(testCases)('%s', createSchemaAsserter(VariablesValidationSchema));
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # not an object
      - invalid

      # array instead of object
      - []

      # variable value is number
      - port: 8080

      # variable value is boolean
      - enabled: true

      # variable value is object
      - config:
          nested: value

      # variable value is array
      - items:
          - item1
          - item2

      # variable value is null
      - nullable: null
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(VariablesValidationSchema),
    );
  });
});
