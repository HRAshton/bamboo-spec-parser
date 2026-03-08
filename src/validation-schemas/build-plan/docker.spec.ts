import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { createSchemaAsserter } from '../../helpers/test-helpers.ts';
import { DockerValidationSchema } from './docker.ts';

describe('DockerValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      - 'openjdk:11'

      -
        image: 'openjdk:11'

      -
        image: 'custom/image:latest'
        volumes:
          '/host/path': '/container/path'
        'use-default-volumes': true
        'docker-run-arguments':
          - '--privileged'
          - '--rm'

      -
        image: 'busybox'
        volumes: {}
        'docker-run-arguments': []
    `).toJS();

    it.each(testCases)('%s', createSchemaAsserter(DockerValidationSchema));
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      - 123

      - {}

      -
        image: 'nginx'
        volumes:
          - '/host/path'

      -
        image: 'nginx'
        'docker-run-arguments': '--detach'

      -
        image: 'nginx'
        volumes:
          '/host/path': 123

      -
        image: 'nginx'
        'use-default-volumes': 'yes'

      -
        'docker-run-arguments':
          - 1
          - true
    `).toJS();

    it.each(testCases)('%s', (testCase) => {
      expect(() => DockerValidationSchema.parse(testCase)).toThrow();
    });
  });
});
