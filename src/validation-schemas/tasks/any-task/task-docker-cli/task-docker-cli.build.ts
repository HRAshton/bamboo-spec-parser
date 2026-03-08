import { z } from 'zod';
import { StringOrBooleanValidationSchema } from '../../../shared/shared-types.ts';
import {
  DockerCommonValidationProperties,
  SaveValidationProperties,
} from './task-docker-cli.common.ts';

export const CommandOption = 'build' as const;

export const BuildCommonValidationProperties = {
  ...DockerCommonValidationProperties,
  ...SaveValidationProperties,
  commandOption: z.literal(CommandOption),
  repository: z.string(),
  buildOptions: z.string().optional(),
  nocache: StringOrBooleanValidationSchema.optional(),
};

export const BuildInlineConfigurationShape = {
  ...BuildCommonValidationProperties,
  dockerfileOption: z.literal('inline'),
  dockerfile: z.string(),
};

export const BuildExistingConfigurationShape = {
  ...BuildCommonValidationProperties,
  dockerfileOption: z.literal('existing'),
};

export const BuildConfigurationValidationSchema = z.discriminatedUnion(
  'dockerfileOption',
  [
    z.object(BuildInlineConfigurationShape),
    z.object(BuildExistingConfigurationShape),
  ],
);
