import { z } from 'zod';

export const DeploymentPermissions = [
  'view',
  'view-configuration',
  'edit',
  'clone',
  'approve-release',
  'create-release',
  'admin',
];

export const EnvironmentPermissions = [
  'view',
  'view-configuration',
  'edit',
  'deploy',
];

export const DeploymentProjectPermissionsPermissionsValidationSchema = z.object(
  {
    users: z.array(z.string()).optional(),
    groups: z.array(z.string()).optional(),
    roles: z.array(z.string()).optional(),
    permissions: z.array(z.enum(DeploymentPermissions)),
  },
);

export const EnvironmentPermissionsValidationSchema = z.object({
  users: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.enum(EnvironmentPermissions)),
});

export type DeploymentProjectPermissions = z.infer<
  typeof DeploymentProjectPermissionsPermissionsValidationSchema
>;
export type EnvironmentPermissions = z.infer<
  typeof EnvironmentPermissionsValidationSchema
>;
