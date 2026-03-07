import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { ScriptTaskValidationSchema } from './script.ts';

describe('ScriptTaskValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases = parseAndExtendTaskTestCases(`
      # inline script with bash
      - script: | 
          #!/bin/bash
          Hello Bamboo
      
      # script from file path
      - script: path/to/my/script.sh
      
      # PowerShell script
      - script:
          interpreter: WINDOWS_POWER_SHELL
          scripts:
          - echo "Hello World!"
      
      # shell script with arguments and environment
      - script:
          interpreter: /bin/sh
          file: ant-build.sh
          argument: --verbose
          environment: ANT_OPTS=-Xmx700m
          working-dir: rockets
          
      # Direct array
      - script:
        - touch report.xml
    `);

    it.each(testCases)('%s', createSchemaAsserter(ScriptTaskValidationSchema));
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      - script: 123

      - script:
          interpreter: 999

      - script:
          scripts: 123

      - script:
          scripts:
            - 123

      - script:
          file: true

      - script:
          argument: []

      - script:
          environment: 42

      - script:
          working-dir: false
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(ScriptTaskValidationSchema),
    );
  });
});
