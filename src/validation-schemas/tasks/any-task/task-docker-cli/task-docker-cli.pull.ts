import { z } from 'zod';
import {
  AuthProperties,
  DockerCommonValidationProperties,
} from './task-docker-cli.common.ts';

export const PullCommandOption = 'pull' as const;

const configurationShape = {
  commandOption: z.literal(PullCommandOption),
  pullRepository: z.string(),
  pullRegistryOption: z.enum(['hub', 'custom']),
  ...AuthProperties,
  ...DockerCommonValidationProperties,
};

export const PullConfigurationValidationSchema = z.object(configurationShape);
