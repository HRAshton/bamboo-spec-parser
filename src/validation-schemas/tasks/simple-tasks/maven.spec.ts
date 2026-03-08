import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { MavenTaskValidationSchema } from './maven.ts';

describe('MavenTaskValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases = parseAndExtendTaskTestCases(`
      # basic maven task
      - maven:
            executable: Maven 3.2
            jdk: JDK 1.8
            goal: clean install
            tests: false

      # maven with test parsing
      - maven:
          executable: Maven 3.2
          jdk: JDK 1.8
          goal: clean install
          tests: '**/my-acceptance-tests/target/surefire-reports/*.xml'

      # maven with environment and working directory
      - maven:
          executable: Maven 3.2
          jdk: JDK 1.8
          goal: clean install
          tests: false
          environment: MAVEN_OPTS="-Xmx768m -Xms64m -Dmaven.compiler.fork=true"
          working-dir: maven-working-dir
    `);

    it.each(testCases)('%s', createSchemaAsserter(MavenTaskValidationSchema));
  });

  describe('Negative tests', () => {
    const invalidCases: unknown[] = parseDocument(`
      - maven: 123

      - maven:
          executable: 123

      - maven:
          jdk: true

      - maven:
          goal: 999

      - maven:
          executable: Maven 3.2
          jdk: JDK 1.8
          goal: clean install
          tests: true

      - maven:
          executable: Maven 3.2
          jdk: JDK 1.8
          goal: clean install
          environment: true

      - maven:
          executable: Maven 3.2
          jdk: JDK 1.8
          goal: clean install
          working-dir: 42
    `).toJS();

    it.each(invalidCases)(
      '%s',
      createFailSchemaAsserter(MavenTaskValidationSchema),
    );
  });
});
