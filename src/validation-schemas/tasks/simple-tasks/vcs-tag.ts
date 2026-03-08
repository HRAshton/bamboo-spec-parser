import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'vcs-tag' as const;

const partialObjectParamsShape = {
  tag: z.string(),
  repository: z.string().optional(),
  'working-dir': z.string().optional(),
};

export const TaskParamsFullSchema = BaseFullTaskParamsSchema.extend(
  partialObjectParamsShape,
);

export const VcsTagTaskValidationSchema = z.object({
  [TaskName]: TaskParamsFullSchema,
});

export type VcsTagTask = z.infer<typeof VcsTagTaskValidationSchema>;
