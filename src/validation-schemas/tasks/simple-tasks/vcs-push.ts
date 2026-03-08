import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'vcs-push' as const;

const partialObjectParamsShape = {
  repository: z.string(),
  'working-dir': z.string().optional(),
};

export const TaskParamsFullSchema = BaseFullTaskParamsSchema.extend(
  partialObjectParamsShape,
);

export const VcsPushTaskValidationSchema = z.union([
  z.literal(TaskName),
  z.object({ [TaskName]: TaskParamsFullSchema }),
]);

export type VcsPushTask = z.infer<typeof VcsPushTaskValidationSchema>;
