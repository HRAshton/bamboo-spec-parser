import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

const partialObjectParamsShape = {
  repository: z.string().optional(),
  path: z.string().optional(),
  'force-clean-build': z.boolean().optional(),
};

export const TaskName = 'checkout' as const;

export const TaskParamsFullSchema = BaseFullTaskParamsSchema.extend(
  partialObjectParamsShape,
);

export const TaskFullSchema = z.object({
  [TaskName]: TaskParamsFullSchema,
});

export const CheckoutTaskValidationSchema = z.union([
  z.literal(TaskName),
  z.object({ [TaskName]: z.string() }),
  TaskFullSchema,
]);

export type CheckoutTask = z.infer<typeof CheckoutTaskValidationSchema>;
