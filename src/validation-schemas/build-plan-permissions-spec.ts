import { z } from 'zod';
import { PermissionsValidationSchema } from './build-plan';

export const BuildPlanPermissionsValidationSchema = z.strictObject({
  version: z.literal(2),
  'server-name': z.string().optional(),

  plan: z.object({
    key: z.string().min(1),
  }),

  'plan-permissions': z.array(PermissionsValidationSchema),
});

export type BuildPlanPermissionsSpec = z.infer<
  typeof BuildPlanPermissionsValidationSchema
>;
