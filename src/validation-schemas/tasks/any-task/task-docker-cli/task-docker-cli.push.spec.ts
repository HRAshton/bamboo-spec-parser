import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
} from '../../../../helpers/test-helpers.ts';
import { PushConfigurationValidationSchema } from './task-docker-cli.push.ts';

describe('Push command', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      # hub registry - required fields only
      - commandOption: push
        pushRepository: myorg/myapp:latest
        pushRegistryOption: hub

      # hub registry - all optional auth fields
      - commandOption: push
        pushRepository: myorg/myapp:v1.0.0
        pushRegistryOption: hub
        username: dockeruser
        password: dockerpass
        pushSharedCredentialsId: hub-creds

      # hub registry - only pushSharedCredentialsId
      - commandOption: push
        pushRepository: ubuntu/ubuntu:latest
        pushRegistryOption: hub
        pushSharedCredentialsId: hub-creds

      # hub registry - only username/password
      - commandOption: push
        pushRepository: postgres/postgres:13
        pushRegistryOption: hub
        username: user
        password: pass

      # hub registry - environmentVariables
      - commandOption: push
        pushRepository: redis/redis:latest
        pushRegistryOption: hub
        environmentVariables: PUSH_TIMEOUT=120 COMPRESSION=gzip

      # hub registry - workingSubDirectory
      - commandOption: push
        pushRepository: alpine/alpine:latest
        pushRegistryOption: hub
        workingSubDirectory: docker/images

      # hub registry - all optional fields
      - commandOption: push
        pushRepository: myorg/myapp:v1.2.3
        pushRegistryOption: hub
        pushSharedCredentialsId: docker-hub-creds
        environmentVariables: REGISTRY_MIRROR=https://mirror.example.com TIMEOUT=300
        workingSubDirectory: services/docker

      # custom registry - required fields only
      - commandOption: push
        pushRepository: registry.example.com/myapp:latest
        pushRegistryOption: custom

      # custom registry - with auth credentials
      - commandOption: push
        pushRepository: private.registry.io/team/app:main
        pushRegistryOption: custom
        username: registryuser
        password: registrypass

      # custom registry - with shared credentials
      - commandOption: push
        pushRepository: registry.company.com/app:latest
        pushRegistryOption: custom
        pushSharedCredentialsId: company-registry-creds

      # field ordering - properties in any order
      - pushRegistryOption: hub
        pushRepository: myorg/app:latest
        commandOption: push
        workingSubDirectory: services

      # special characters - repository with port
      - commandOption: push
        pushRepository: registry.example.com:5000/myapp:latest
        pushRegistryOption: custom

      # special characters - complex repository reference
      - commandOption: push
        pushRepository: registry.io/namespace/org/app:v1.2.3-beta.1+build.123
        pushRegistryOption: custom

      # special characters - password with special characters
      - commandOption: push
        pushRepository: myapp:latest
        pushRegistryOption: hub
        password: 'p@ss:word!#$%&*()'

      # special characters - username with dots and dashes
      - commandOption: push
        pushRepository: myapp:latest
        pushRegistryOption: hub
        username: user.name-123

      # special characters - empty environmentVariables
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub
        environmentVariables: ''

      # auth combinations - both username/password and pushSharedCredentialsId
      - commandOption: push
        pushRepository: myapp:latest
        pushRegistryOption: hub
        username: user
        password: pass
        pushSharedCredentialsId: creds-id

      # auth combinations - only username
      - commandOption: push
        pushRepository: myapp:latest
        pushRegistryOption: hub
        username: user

      # auth combinations - only password
      - commandOption: push
        pushRepository: myapp:latest
        pushRegistryOption: hub
        password: pass

      # auth combinations - pullSharedCredentialsId (cross-field)
      - commandOption: push
        pushRepository: myapp:latest
        pushRegistryOption: hub
        pullSharedCredentialsId: pull-creds

      # optional fields - undefined optional fields
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub

      # optional fields - partial optional fields
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub
        username: user
        workingSubDirectory: docker
    `).toJS();

    it.each(testCases)(
      '%s',
      createSchemaAsserter(PushConfigurationValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # missing commandOption
      - pushRepository: myorg/app:latest
        pushRegistryOption: hub

      # missing pushRepository
      - commandOption: push
        pushRegistryOption: hub

      # missing pushRegistryOption
      - commandOption: push
        pushRepository: myorg/app:latest

      # invalid commandOption - pull
      - commandOption: pull
        pushRepository: myorg/app:latest
        pushRegistryOption: hub

      # invalid commandOption - build
      - commandOption: build
        pushRepository: myorg/app:latest
        pushRegistryOption: hub

      # invalid pushRegistryOption - docker-hub
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: docker-hub

      # invalid pushRegistryOption - private
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: private

      # type mismatch - pushRepository is number
      - commandOption: push
        pushRepository: 123
        pushRegistryOption: hub

      # type mismatch - commandOption is number
      - commandOption: 123
        pushRepository: myorg/app:latest
        pushRegistryOption: hub

      # type mismatch - username is number
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub
        username: 123

      # type mismatch - password is number
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub
        password: 12345

      # type mismatch - environmentVariables is number
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub
        environmentVariables: 123

      # type mismatch - workingSubDirectory is number
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub
        workingSubDirectory: 123

      # type mismatch - pushSharedCredentialsId is number
      - commandOption: push
        pushRepository: myorg/app:latest
        pushRegistryOption: hub
        pushSharedCredentialsId: 123
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(PushConfigurationValidationSchema),
    );
  });
});
