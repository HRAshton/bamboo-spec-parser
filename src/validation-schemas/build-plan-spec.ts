import { z } from 'zod';
import {
  BranchesValidationSchema,
  DependenciesValidationSchema,
  DockerValidationSchema,
  JobValidationSchema,
  NotificationValidationSchema,
  OtherValidationSchema,
  RepositoryValidationSchema,
  StageValidationSchema,
  TriggerValidationSchema,
  VariablesValidationSchema,
} from './build-plan';

const BuildPlanInfoValidationSchema = z.object({
  'project-key': z.string().min(1),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  rerunnable: z.boolean().optional(),
});

const BranchOverrideValidationSchema = z.record(z.string(), z.any()); // TODO: Build plan validation schema?

export const BuildPlanValidationSchema = z
  .object({
    version: z.literal(2),
    'server-name': z.string().optional(),

    plan: BuildPlanInfoValidationSchema,
    repositories: z.array(RepositoryValidationSchema).optional(),
    triggers: z.array(TriggerValidationSchema).optional(),
    notifications: z.array(NotificationValidationSchema).optional(),
    variables: VariablesValidationSchema.optional(),
    branches: BranchesValidationSchema.optional(),
    dependencies: DependenciesValidationSchema.optional(),
    docker: DockerValidationSchema.optional(),
    stages: z.array(StageValidationSchema).optional(),
    'branch-overrides': z.array(BranchOverrideValidationSchema).optional(),
    labels: z.array(z.string()).optional(),
    other: OtherValidationSchema.optional(),
  })
  .catchall(JobValidationSchema);

export type BuildPlanSpec = z.infer<typeof BuildPlanValidationSchema>;
