import { z } from 'zod';
import {
  AuthProperties,
  DockerCommonValidationProperties,
} from './task-docker-cli.common.ts';

export const PushCommandOption = 'push' as const;

const configurationShape = {
  commandOption: z.literal(PushCommandOption),
  pushRepository: z.string(),
  registryOption: z.enum(['hub', 'custom']),
  ...AuthProperties,
  ...DockerCommonValidationProperties,
};

export const PushConfigurationValidationSchema = z.object(configurationShape);
