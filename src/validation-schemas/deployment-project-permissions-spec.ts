import { z } from 'zod';
import {
  DeploymentProjectPermissionsPermissionsValidationSchema,
  EnvironmentPermissionsValidationSchema,
} from './deployment-project/permissions.ts';

export const DeploymentProjectPermissionsValidationSchema = z.strictObject({
  version: z.literal(2),
  'server-name': z.string().optional(),

  deployment: z.object({
    name: z.string().min(1),
  }),

  'deployment-permissions': z
    .array(DeploymentProjectPermissionsPermissionsValidationSchema)
    .optional(),
  'default-environment-permissions': z
    .array(EnvironmentPermissionsValidationSchema)
    .optional(),
  'environment-permissions': z
    .array(
      z.record(z.string(), z.array(EnvironmentPermissionsValidationSchema)),
    )
    .optional(),
});

export type DeploymentProjectPermissionsSpec = z.infer<
  typeof DeploymentProjectPermissionsValidationSchema
>;
