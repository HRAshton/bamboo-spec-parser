import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'vcs-branch' as const;

const partialObjectParamsShape = {
  repository: z.string().optional(),
  branch: z.string(),
};

export const TaskParamsFullSchema = BaseFullTaskParamsSchema.extend(
  partialObjectParamsShape,
);

export const VcsBranchTaskValidationSchema = z.object({
  [TaskName]: TaskParamsFullSchema,
});

export type VcsBranchTask = z.infer<typeof VcsBranchTaskValidationSchema>;
