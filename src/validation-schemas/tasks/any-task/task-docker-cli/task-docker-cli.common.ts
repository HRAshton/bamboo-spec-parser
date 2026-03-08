import { z } from 'zod';
import { EnvironmentVariablesValidationSchema } from '../../../../helpers/env-variables-converter.ts';
import {
  StringOrBooleanValidationSchema,
  StringOrNumberValidationSchema,
} from '../../../shared/shared-types.ts';

export const DockerPluginKey =
  'com.atlassian.bamboo.plugins.bamboo-docker-plugin:task.docker.cli' as const;

export const DockerCommonValidationProperties = {
  environmentVariables: EnvironmentVariablesValidationSchema.optional(),
  workingSubDirectory: z.string().optional(),
};

// There are 3 different auth types for push and pull commands, and this schema should be split into 3 separate schemas.
// However, I couldn't find a way to "multiply" the push and pull schemas by these auth types without creating
// a lot of code duplication.
export const AuthProperties = {
  pushSharedCredentialsId: z.string().optional(),
  pullSharedCredentialsId: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
};

// The same as Auth. If 'save' is true, 'filename' is required.
export const SaveValidationProperties = {
  save: StringOrBooleanValidationSchema.optional(),
  filename: z.string().optional(),
};

// The same as Auth. If 'serviceWait' is true, 'serviceUrlPattern' and 'serviceTimeout' are required.
// It's good they are defaulted.
export const ServiceWaitValidationProperties = {
  serviceWait: StringOrBooleanValidationSchema.optional(),
  serviceUrlPattern: z.string().optional(),
  serviceTimeout: StringOrNumberValidationSchema.optional(),
};
