import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
} from '../../../../helpers/test-helpers.ts';
import { BuildConfigurationValidationSchema } from './task-docker-cli.build.ts';

describe('Task Docker CLI - Build Command', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      # inline dockerfile - required fields only
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node:14

      # inline dockerfile - all optional fields
      - commandOption: build
        repository: myorg/myapp
        dockerfileOption: inline
        dockerfile: FROM node:14
        nocache: 'true'
        save: 'true'
        filename: custom.Dockerfile
        buildOptions: --build-arg VERSION=1.0.0
        environmentVariables: DOCKER_BUILDKIT=1
        workingSubDirectory: app

      # inline dockerfile - nocache false
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node
        nocache: 'false'

      # inline dockerfile - save false
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node
        save: 'false'

      # inline dockerfile - empty buildOptions
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node
        buildOptions: ''

      # inline dockerfile - multiline content
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: |
          FROM node:14
          RUN npm install
          EXPOSE 3000

      # inline dockerfile - repository with special characters
      - commandOption: build
        repository: registry.example.com:5000/myorg/my-app:v1.0.0
        dockerfileOption: inline
        dockerfile: FROM alpine

      # inline dockerfile - multiple environment variables
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node
        environmentVariables: VAR1=value1 VAR2=value2 VAR3=value3

      # inline dockerfile - filename without save
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node
        filename: output.tar

      # inline dockerfile - save without filename
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node
        save: 'true'

      # existing dockerfile - required fields only
      - commandOption: build
        repository: myrepo
        dockerfileOption: existing

      # existing dockerfile - all optional fields
      - commandOption: build
        repository: my-image
        dockerfileOption: existing
        nocache: 'true'
        save: 'true'
        filename: Dockerfile.prod
        buildOptions: --network=host
        environmentVariables: BUILD_ENV=prod
        workingSubDirectory: docker

      # existing dockerfile - no dockerfile field required
      - commandOption: build
        repository: myimage
        dockerfileOption: existing
        buildOptions: --network=host
    `).toJS();

    it.each(testCases)(
      '%s',
      createSchemaAsserter(BuildConfigurationValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # missing commandOption
      - repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node

      # missing repository
      - commandOption: build
        dockerfileOption: inline
        dockerfile: FROM node

      # missing dockerfileOption
      - commandOption: build
        repository: myrepo
        dockerfile: FROM node

      # missing dockerfile for inline option
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline

      # invalid commandOption value
      - commandOption: invalid
        repository: myrepo
        dockerfileOption: inline
        dockerfile: FROM node

      # invalid dockerfileOption value
      - commandOption: build
        repository: myrepo
        dockerfileOption: invalid-option
        dockerfile: FROM node

      # repository not a string
      - commandOption: build
        repository: 123
        dockerfileOption: inline
        dockerfile: FROM node

      # dockerfile not a string
      - commandOption: build
        repository: myrepo
        dockerfileOption: inline
        dockerfile: 123

      # existing - missing commandOption
      - repository: myrepo
        dockerfileOption: existing

      # existing - missing repository
      - commandOption: build
        dockerfileOption: existing

      # existing - missing dockerfileOption
      - commandOption: build
        repository: myrepo
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(BuildConfigurationValidationSchema),
    );
  });
});
