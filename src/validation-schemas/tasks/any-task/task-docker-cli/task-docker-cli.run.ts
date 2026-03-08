import { z } from 'zod';
import { EnvironmentVariablesValidationSchema } from '../../../../helpers/env-variables-converter.ts';
import { StringOrBooleanValidationSchema } from '../../../shared/shared-types.ts';
import {
  DockerCommonValidationProperties,
  ServiceWaitValidationProperties,
} from './task-docker-cli.common.ts';

export const CommandOption = 'run' as const;

export const RunConfigurationValidationSchema = z
  .object({
    ...DockerCommonValidationProperties,
    ...ServiceWaitValidationProperties,
    commandOption: z.literal(CommandOption),
    image: z.string(),
    detach: StringOrBooleanValidationSchema.optional(),
    link: StringOrBooleanValidationSchema.optional(),
    envVars: EnvironmentVariablesValidationSchema.optional(),
    command: z.string().optional(),
    workDir: z.string().optional(),
    additionalArgs: z.string().optional(),
    hostDirectory_0: z.string().optional(),
    containerDataVolume_0: z.string().optional(),
    hostDirectory_1: z.string().optional(),
    containerDataVolume_1: z.string().optional(),
  })
  .catchall(z.string());
