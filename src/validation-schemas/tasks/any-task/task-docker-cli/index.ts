import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../../base/task-base.ts';
import { BuildConfigurationValidationSchema } from './task-docker-cli.build.ts';
import { DockerPluginKey } from './task-docker-cli.common.ts';
import { PullConfigurationValidationSchema } from './task-docker-cli.pull.ts';
import { PushConfigurationValidationSchema } from './task-docker-cli.push.ts';
import { RunConfigurationValidationSchema } from './task-docker-cli.run.ts';

export const DockerTaskConfigurationValidationSchema = z.discriminatedUnion(
  'commandOption',
  [
    BuildConfigurationValidationSchema,
    RunConfigurationValidationSchema,
    PushConfigurationValidationSchema,
    PullConfigurationValidationSchema,
  ],
);

export const DockerTaskParamsValidationSchema = BaseFullTaskParamsSchema.extend(
  {
    'plugin-key': z.literal(DockerPluginKey),
    configuration: DockerTaskConfigurationValidationSchema,
  },
);
