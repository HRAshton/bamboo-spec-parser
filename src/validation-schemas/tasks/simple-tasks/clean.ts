import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'clean' as const;

export const TaskParamsSchema = BaseFullTaskParamsSchema;

export const TaskStringSchema = z.literal(TaskName);

export const TaskFullSchema = z.object({ [TaskName]: TaskParamsSchema });

export const CleanTaskValidationSchema = z.union([
  TaskStringSchema,
  TaskFullSchema,
]);

export type CleanTask = z.infer<typeof CleanTaskValidationSchema>;
