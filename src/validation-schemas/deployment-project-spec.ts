import { z } from 'zod';
import {
  DockerValidationSchema,
  RepositoryValidationSchema,
  RequirementValidationSchema,
  VariablesValidationSchema,
} from './build-plan';
import { ArtifactSubscriptionValidationSchema } from './build-plan/job.ts';
import { DeploymentNotificationValidationSchema } from './deployment-project/notifications.ts';
import { EnvironmentPermissionsValidationSchema } from './deployment-project/permissions.ts';
import { DeploymentEnvironmentTriggerValidationSchema } from './deployment-project/triggers.ts';
import { TasksValidationSchema } from './tasks';

const DeploymentProjectInfoValidationSchema = z.object({
  name: z.string().min(1),
  'source-plan': z.string(),
  description: z.string().optional(),
});

const ReleaseNamingValidationSchema = z.object({
  'next-version-name': z.string().optional(),
  'applies-to-branches': z.boolean().optional(),
  'auto-increment': z.boolean().optional(),
  'auto-increment-variables': z.array(z.string()).optional(),
});

const EnvironmentValidationSchema = z.object({
  tasks: z.array(TasksValidationSchema).optional(),
  'final-tasks': z.array(TasksValidationSchema).optional(),
  variables: VariablesValidationSchema.optional(),
  docker: DockerValidationSchema.optional(),
  requirements: z.array(RequirementValidationSchema).optional(),
  triggers: z.array(DeploymentEnvironmentTriggerValidationSchema).optional(),
  notifications: z.array(DeploymentNotificationValidationSchema).optional(),
  permissions: z.array(EnvironmentPermissionsValidationSchema).optional(),
  'artifact-subscriptions': z
    .array(ArtifactSubscriptionValidationSchema)
    .optional(),
});

export const DeploymentProjectValidationSchema = z
  .object({
    version: z.literal(2),
    'server-name': z.string().optional(),

    deployment: DeploymentProjectInfoValidationSchema,
    repositories: z.array(RepositoryValidationSchema).optional(),
    'release-naming': ReleaseNamingValidationSchema,
    environments: z.array(z.string()).optional(),
  })
  .catchall(EnvironmentValidationSchema);

export type DeploymentProjectSpec = z.infer<
  typeof DeploymentProjectValidationSchema
>;
