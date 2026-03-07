import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'vcs-commit' as const;

const partialObjectParamsShape = {
  message: z.string(),
  repository: z.string().optional(),
};

export const TaskParamsFullSchema = BaseFullTaskParamsSchema.extend(
  partialObjectParamsShape,
);

export const VcsCommitTaskValidationSchema = z.object({
  [TaskName]: TaskParamsFullSchema,
});

export type VcsCommitTask = z.infer<typeof VcsCommitTaskValidationSchema>;
