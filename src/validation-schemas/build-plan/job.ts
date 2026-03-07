import z from 'zod';
import { StringOrBooleanValidationSchema } from '../shared/shared-types.ts';
import { TasksValidationSchema } from '../tasks';
import { ArtifactValidationSchema } from './artifacts.ts';
import { DockerValidationSchema } from './docker.ts';
import { RequirementValidationSchema } from './requirements.ts';

export const ArtifactSubscriptionValidationSchema = z.object({
  artifact: z.string(),
  destination: z.string(),
});

const AutoShape = {
  regex: z.string().optional(),
  label: z.string().optional(),
};

const BuildHangingConfigShape = {
  minutesBetweenLogs: z.union([z.string(), z.number()]).optional(),
  minutesQueueTimeout: z.union([z.string(), z.number()]).optional(),
  multiplier: z.string().optional(),
  enabled: StringOrBooleanValidationSchema.optional(),
};

const NcoverShape = {
  path: z.string().optional(),
  exists: StringOrBooleanValidationSchema.optional(),
};

const CloverShape = {
  path: z.string().optional(),
  exists: StringOrBooleanValidationSchema.optional(),
  integration: z.string().optional(),
  useLocalLicenseKey: StringOrBooleanValidationSchema.optional(),
};

export const OtherValidationSchema = z.object({
  'clean-working-dir': z.boolean().optional(),
  'all-other-apps': z
    .object({
      custom: z.object({
        'com.atlassian.bamboo.build.test.skip.history.enabled':
          StringOrBooleanValidationSchema.optional(),
        auto: z.object(AutoShape).optional(),
        buildHangingConfig: z.object(BuildHangingConfigShape).optional(),
        ncover: z.object(NcoverShape).optional(),
        clover: z.object(CloverShape).optional(),
      }),
    })
    .optional(),
});

export const JobValidationSchema = z.object({
  key: z.string().optional(),
  tasks: z.array(TasksValidationSchema).optional(),
  'final-tasks': z.array(TasksValidationSchema).optional(),
  artifacts: z.array(ArtifactValidationSchema).optional(),
  'artifact-subscriptions': z
    .array(ArtifactSubscriptionValidationSchema)
    .optional(),
  requirements: z.array(RequirementValidationSchema).optional(),
  docker: DockerValidationSchema.optional(),
  other: OtherValidationSchema.optional(),
});

export type Job = z.infer<typeof JobValidationSchema>;
