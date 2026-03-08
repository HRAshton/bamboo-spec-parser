import { z } from 'zod';

export const PlanPermissionsEnum = z.enum([
  'view',
  'edit',
  'build',
  'clone',
  'admin',
]);

export const PermissionsValidationSchema = z.object({
  users: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(PlanPermissionsEnum),
});

export type Permissions = z.infer<typeof PermissionsValidationSchema>;
