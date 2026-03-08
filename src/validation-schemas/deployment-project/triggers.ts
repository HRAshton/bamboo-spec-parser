import { z } from 'zod';

export const BuildSuccessTriggerStringValidationSchema =
  z.literal('build-success');

export const BuildSuccessTriggerObjectValidationSchema = z.object({
  'build-success': z.object({
    branch: z.string(),
  }),
});

export const BuildSuccessTriggerValidationSchema = z.union([
  BuildSuccessTriggerStringValidationSchema,
  BuildSuccessTriggerObjectValidationSchema,
]);

export const StageSuccessTriggerKvpValidationSchema = z.object({
  'stage-success': z.string(),
});

export const StageSuccessTriggerObjectValidationSchema = z.object({
  'stage-success': z.object({
    stage: z.string(),
    branch: z.string().optional(),
  }),
});

export const StageSuccessTriggerValidationSchema = z.union([
  StageSuccessTriggerKvpValidationSchema,
  StageSuccessTriggerObjectValidationSchema,
]);

export const EnvironmentSuccessTriggerKvpValidationSchema = z.object({
  'environment-success': z.string(),
});

export const EnvironmentSuccessTriggerObjectValidationSchema = z.object({
  'environment-success': z.object({
    environment: z.string(),
  }),
});

export const EnvironmentSuccessTriggerValidationSchema = z.union([
  EnvironmentSuccessTriggerKvpValidationSchema,
  EnvironmentSuccessTriggerObjectValidationSchema,
]);

export const CronTriggerKvpValidationSchema = z.object({
  cron: z.string(),
});

export const CronTriggerObjectValidationSchema = z.object({
  cron: z.object({
    expression: z.string(),
    'artifact-branch': z.string().optional(),
    'skip-if-version-deployed': z.boolean().optional(),
  }),
});

export const CronTriggerValidationSchema = z.union([
  CronTriggerKvpValidationSchema,
  CronTriggerObjectValidationSchema,
]);

export const DeploymentEnvironmentTriggerValidationSchema = z.union([
  BuildSuccessTriggerValidationSchema,
  StageSuccessTriggerValidationSchema,
  EnvironmentSuccessTriggerValidationSchema,
  CronTriggerValidationSchema,
]);

export type DeploymentEnvironmentTrigger = z.infer<
  typeof DeploymentEnvironmentTriggerValidationSchema
>;
