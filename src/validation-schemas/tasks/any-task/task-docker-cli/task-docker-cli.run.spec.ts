import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
} from '../../../../helpers/test-helpers.ts';
import { RunConfigurationValidationSchema } from './task-docker-cli.run.ts';

describe('Run command', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      # required fields - commandOption and image
      - commandOption: run
        image: node:14

      # required fields - with envVars
      - commandOption: run
        image: postgres:13
        envVars: "VAR1=value1"

      # required fields - with multiple envVars
      - commandOption: run
        image: ubuntu:20.04
        envVars: "VAR1=value1 VAR2=value2"

      # boolean fields - detach true
      - commandOption: run
        image: node:14
        detach: 'true'

      # boolean fields - detach false
      - commandOption: run
        image: node:14
        detach: 'false'

      # boolean fields - link true
      - commandOption: run
        image: node:14
        link: 'true'

      # boolean fields - both detach and link
      - commandOption: run
        image: node:14
        detach: 'true'
        link: 'false'

      # service wait - serviceWait true
      - commandOption: run
        image: postgres:13
        serviceWait: 'true'

      # service wait - serviceWait false
      - commandOption: run
        image: postgres:13
        serviceWait: 'false'

      # service wait - serviceUrlPattern
      - commandOption: run
        image: postgres:13
        serviceUrlPattern: http://localhost:5432

      # service wait - serviceTimeout
      - commandOption: run
        image: postgres:13
        serviceTimeout: '60'

      # service wait - all properties
      - commandOption: run
        image: postgres:13
        serviceWait: 'true'
        serviceUrlPattern: http://db:5432/health
        serviceTimeout: '30'

      # string fields - workDir
      - commandOption: run
        image: node:14
        workDir: /app

      # string fields - command
      - commandOption: run
        image: node:14
        command: npm start

      # string fields - additionalArgs
      - commandOption: run
        image: node:14
        additionalArgs: --rm -p 8080:3000

      # string fields - workingSubDirectory
      - commandOption: run
        image: node:14
        workingSubDirectory: services

      # string fields - environmentVariables
      - commandOption: run
        image: node:14
        environmentVariables: BUILD_ID=123

      # volume mapping - single volume
      - commandOption: run
        image: node:14
        hostDirectory_0: /host/data
        containerDataVolume_0: /data

      # volume mapping - multiple volumes
      - commandOption: run
        image: postgres:13
        hostDirectory_0: /host/data
        containerDataVolume_0: /data
        hostDirectory_1: /host/config
        containerDataVolume_1: /config

      # volume mapping - partial mappings
      - commandOption: run
        image: node:14
        hostDirectory_0: /host/data
        containerDataVolume_0: /data
        hostDirectory_1: /another/path

      # field ordering - properties in any order
      - image: node:14
        commandOption: run
        detach: 'true'
        workDir: /app

      # special characters - image with registry and tag
      - commandOption: run
        image: registry.example.com:5000/node:14-alpine

      # special characters - workDir with spaces
      - commandOption: run
        image: node:14
        workDir: "/home/user/my app"

      # special characters - command with complex arguments
      - commandOption: run
        image: node:14
        command: npm run build -- --prod --sourcemap=false

      # special characters - additionalArgs with special characters
      - commandOption: run
        image: node:14
        additionalArgs: --env "VAR=val with spaces" --label version=1.0.0

      # special characters - serviceUrlPattern with variables
      - commandOption: run
        image: postgres:13
        serviceUrlPattern: http://postgres:\${POSTGRES_PORT}/health

      # environment variables - envVars as string
      - commandOption: run
        image: node:14
        envVars: "NODE_ENV=production PORT=3000"

      # environment variables - both envVars and environmentVariables
      - commandOption: run
        image: node:14
        envVars: "NODE_ENV=production"
        environmentVariables: "BUILD_ID=123"
    `).toJS();

    it.each(testCases)(
      '%s',
      createSchemaAsserter(RunConfigurationValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # missing commandOption
      - image: node:14

      # missing image
      - commandOption: run

      # invalid commandOption - build
      - commandOption: build
        image: node:14

      # invalid commandOption - random string
      - commandOption: invalid
        image: node:14

      # type mismatch - image is number
      - commandOption: run
        image: 123

      # type mismatch - commandOption is number
      - commandOption: 123
        image: node:14

      # type mismatch - workDir is number
      - commandOption: run
        image: node:14
        workDir: 123

      # type mismatch - command is number
      - commandOption: run
        image: node:14
        command: 123

      # type mismatch - additionalArgs is number
      - commandOption: run
        image: node:14
        additionalArgs: 123

      # type mismatch - workingSubDirectory is number
      - commandOption: run
        image: node:14
        workingSubDirectory: 123

      # type mismatch - serviceTimeout not numeric
      - commandOption: run
        image: node:14
        serviceTimeout: not-a-number

      # type mismatch - hostDirectory is number
      - commandOption: run
        image: node:14
        hostDirectory_0: 123

      # type mismatch - containerDataVolume is number
      - commandOption: run
        image: node:14
        containerDataVolume_0: 123
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(RunConfigurationValidationSchema),
    );
  });
});
