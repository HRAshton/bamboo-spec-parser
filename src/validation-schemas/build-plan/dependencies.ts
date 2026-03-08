import { z } from 'zod';

export const BlockStrategyValidationSchema = z.enum([
  'none',
  'block_if_parent_in_progress',
  'block_if_parent_failed',
  'block_if_parent_unsuccessful',
]);

export const DependenciesValidationSchema = z.object({
  'require-all-stages-passing': z.boolean().optional(),
  'enabled-for-branches': z.boolean().optional(),
  'block-strategy': BlockStrategyValidationSchema.optional(),
  plans: z.array(z.string()).optional(),
});

export type Dependencies = z.infer<typeof DependenciesValidationSchema>;
