import { z } from 'zod';

export const CreationValidationSchema = z.union([
  z.literal('manually'),
  z.literal('for-pull-request'),
  z.literal('for-new-branch'),
  z.object({
    'for-new-branch': z.string().optional(),
    'for-pull-request': z
      .object({
        'accept-fork': z.boolean(),
      })
      .optional(),
  }),
]);

export const PositiveOrNeverValidationSchema = z.union([
  z.number().int().positive(),
  z.literal('never'),
]);

const BranchRetentionValidationSchema = z.object({
  'after-deleted-days': PositiveOrNeverValidationSchema.optional(),
  'after-inactive-days': PositiveOrNeverValidationSchema.optional(),
});

export const DeletionValidationSchema = z.union([
  z.literal('never'),
  BranchRetentionValidationSchema,
]);

export const IntegrationValidationSchema = z.object({
  'merge-from': z.string(),
  'push-on-success': z.boolean().optional(),
});

export const BranchesValidationSchema = z.object({
  create: CreationValidationSchema.optional(),
  delete: DeletionValidationSchema.optional(),
  integration: IntegrationValidationSchema.optional(),
  'link-to-jira': z.boolean().optional(),
});

export type Branches = z.infer<typeof BranchesValidationSchema>;
