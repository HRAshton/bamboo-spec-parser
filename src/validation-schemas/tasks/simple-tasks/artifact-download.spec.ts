import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { ArtifactDownloadTaskValidationSchema } from './artifact-download.ts';

describe('ArtifactDownloadTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseAndExtendTaskTestCases(`
      # Simple form - no parameters
      - artifact-download

      # With empty artifacts array
      - artifact-download:
          artifacts: []

      # Direct artifact specification (name + destination at root level)
      - artifact-download:
          name: AllPackages
          destination: /workdir

      # Empty artifact object in array
      - artifact-download:
          artifacts:
          - {}

      # Multiple artifacts with names and destinations
      - artifact-download:
          artifacts:
            - name: my-artifacts
              destination: /my-artifacts
            - name: their-artifacts

      # Full specification with source-plan, custom-branch, and artifacts
      - artifact-download:
          source-plan: PROJECTKEY-PLANKEY
          custom-branch: feature-branch
          artifacts:
            - destination: /
            - name: an artifact
              destination: subdirectory

      # Source plan without artifacts (downloads all artifacts)
      - artifact-download:
          source-plan: PROJECTKEY-PLANKEY

      # Source plan with custom branch, no artifacts specified
      - artifact-download:
          source-plan: PROJECTKEY-PLANKEY
          custom-branch: develop

      # Artifact with only destination (downloads all to specific path)
      - artifact-download:
          artifacts:
            - destination: /workdir

      # Artifact with only name (downloads specific artifact to root)
      - artifact-download:
          artifacts:
            - name: WAR

      # Multiple artifacts with mixed specifications
      - artifact-download:
          artifacts:
            - name: WAR
            - destination: /libs
            - name: DATA
              destination: /data

      # Direct specification with only name
      - artifact-download:
          name: my-artifact

      # Direct specification with only destination
      - artifact-download:
          destination: /output
    `);

    it.each(testCases)(
      '%s',
      createSchemaAsserter(ArtifactDownloadTaskValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # Mixed simple and full mode
      - artifact-download:
          source-plan: PROJECTKEY-PLANKEY
          name: should-not-mix

      # Mixed simple and full mode
      - artifact-download:
          artifacts: []
          destination: /workdir

      # Wrong artifacts type
      - artifact-download:
          artifacts: not-an-array

      # Wrong artifact item type
      - artifact-download:
          artifacts:
            - just-a-string

      # Wrong source-plan type
      - artifact-download:
          source-plan: 123

      # Wrong custom-branch type
      - artifact-download:
          custom-branch: true

      # Wrong simple name type
      - artifact-download:
          name: 42

      # Wrong simple destination type
      - artifact-download:
          destination:
            nested: object

      # Wrong task parameter type
      - artifact-download: 123
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(ArtifactDownloadTaskValidationSchema),
    );
  });
});
