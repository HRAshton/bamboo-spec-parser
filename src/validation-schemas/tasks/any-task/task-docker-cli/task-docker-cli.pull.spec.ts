import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
} from '../../../../helpers/test-helpers.ts';
import { PullConfigurationValidationSchema } from './task-docker-cli.pull.ts';

describe('Pull command', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      # hub registry - required fields only
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub

      # hub registry - all optional auth fields
      - commandOption: pull
        pullRepository: myorg/myapp:latest
        pullRegistryOption: hub
        username: dockeruser
        password: dockerpass
        pullSharedCredentialsId: hub-creds

      # hub registry - only pullSharedCredentialsId
      - commandOption: pull
        pullRepository: ubuntu:20.04
        pullRegistryOption: hub
        pullSharedCredentialsId: hub-creds

      # hub registry - only username/password
      - commandOption: pull
        pullRepository: postgres:13
        pullRegistryOption: hub
        username: user
        password: pass

      # hub registry - environmentVariables
      - commandOption: pull
        pullRepository: redis:latest
        pullRegistryOption: hub
        environmentVariables: PULL_TIMEOUT=60 LOG_LEVEL=debug

      # hub registry - workingSubDirectory
      - commandOption: pull
        pullRepository: alpine:latest
        pullRegistryOption: hub
        workingSubDirectory: docker/images

      # hub registry - all optional fields
      - commandOption: pull
        pullRepository: myorg/myapp:v1.2.3
        pullRegistryOption: hub
        pullSharedCredentialsId: docker-hub-creds
        environmentVariables: PROXY_URL=http://proxy:8080 TIMEOUT=120
        workingSubDirectory: services/docker

      # custom registry - required fields only
      - commandOption: pull
        pullRepository: registry.example.com/myapp:latest
        pullRegistryOption: custom

      # custom registry - with auth credentials
      - commandOption: pull
        pullRepository: private.registry.io/team/app:main
        pullRegistryOption: custom
        username: registryuser
        password: registrypass

      # custom registry - with shared credentials
      - commandOption: pull
        pullRepository: registry.company.com/app:latest
        pullRegistryOption: custom
        pullSharedCredentialsId: company-registry-creds

      # field ordering - properties in any order
      - pullRegistryOption: hub
        pullRepository: node:14
        commandOption: pull
        workingSubDirectory: services

      # special characters - repository with port
      - commandOption: pull
        pullRepository: registry.example.com:5000/myapp:latest
        pullRegistryOption: custom

      # special characters - complex repository reference
      - commandOption: pull
        pullRepository: registry.io/namespace/org/app:v1.2.3-beta.1+build.123
        pullRegistryOption: custom

      # special characters - password with special characters
      - commandOption: pull
        pullRepository: myapp:latest
        pullRegistryOption: hub
        password: 'p@ss:word!#$%&*()'

      # special characters - username with dots and dashes
      - commandOption: pull
        pullRepository: myapp:latest
        pullRegistryOption: hub
        username: user.name-123

      # special characters - empty environmentVariables
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub
        environmentVariables: ''

      # auth combinations - both username/password and pullSharedCredentialsId
      - commandOption: pull
        pullRepository: myapp:latest
        pullRegistryOption: hub
        username: user
        password: pass
        pullSharedCredentialsId: creds-id

      # auth combinations - only username
      - commandOption: pull
        pullRepository: myapp:latest
        pullRegistryOption: hub
        username: user

      # auth combinations - only password
      - commandOption: pull
        pullRepository: myapp:latest
        pullRegistryOption: hub
        password: pass

      # auth combinations - pushSharedCredentialsId (cross-field)
      - commandOption: pull
        pullRepository: myapp:latest
        pullRegistryOption: hub
        pushSharedCredentialsId: push-creds

      # optional fields - undefined optional fields
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub

      # optional fields - partial optional fields
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub
        username: user
        workingSubDirectory: docker
    `).toJS();

    it.each(testCases)(
      '%s',
      createSchemaAsserter(PullConfigurationValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # missing commandOption
      - pullRepository: node:14
        pullRegistryOption: hub

      # missing pullRepository
      - commandOption: pull
        pullRegistryOption: hub

      # missing pullRegistryOption
      - commandOption: pull
        pullRepository: node:14

      # invalid commandOption - push
      - commandOption: push
        pullRepository: node:14
        pullRegistryOption: hub

      # invalid commandOption - build
      - commandOption: build
        pullRepository: node:14
        pullRegistryOption: hub

      # invalid pullRegistryOption - docker-hub
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: docker-hub

      # invalid pullRegistryOption - private
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: private

      # type mismatch - pullRepository is number
      - commandOption: pull
        pullRepository: 123
        pullRegistryOption: hub

      # type mismatch - commandOption is number
      - commandOption: 123
        pullRepository: node:14
        pullRegistryOption: hub

      # type mismatch - username is number
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub
        username: 123

      # type mismatch - password is number
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub
        password: 12345

      # type mismatch - environmentVariables is number
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub
        environmentVariables: 123

      # type mismatch - workingSubDirectory is number
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub
        workingSubDirectory: 123

      # type mismatch - pullSharedCredentialsId is number
      - commandOption: pull
        pullRepository: node:14
        pullRegistryOption: hub
        pullSharedCredentialsId: 123
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(PullConfigurationValidationSchema),
    );
  });
});
