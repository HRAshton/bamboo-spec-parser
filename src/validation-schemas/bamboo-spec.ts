import { z } from 'zod';
import { BuildPlanPermissionsValidationSchema } from './build-plan-permissions-spec.ts';
import { BuildPlanValidationSchema } from './build-plan-spec.ts';
import { DeploymentProjectPermissionsValidationSchema } from './deployment-project-permissions-spec.ts';
import { DeploymentProjectValidationSchema } from './deployment-project-spec.ts';

export const BambooSpecSchema = z.union([
  BuildPlanValidationSchema,
  DeploymentProjectValidationSchema,
  BuildPlanPermissionsValidationSchema,
  DeploymentProjectPermissionsValidationSchema,
]);

export type BambooSpec = z.infer<typeof BambooSpecSchema>;
