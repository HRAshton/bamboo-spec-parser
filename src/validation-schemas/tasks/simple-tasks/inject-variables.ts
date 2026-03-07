import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const ScopeEnumSchema = z
  .string()
  .toUpperCase()
  .pipe(z.enum(['LOCAL', 'RESULT']));

export const TaskName = 'inject-variables' as const;

const partialObjectParamsShape = {
  file: z.string(),
  scope: ScopeEnumSchema.optional(),
  namespace: z.string().optional(),
};

export const StringParamsKvpValidationSchema = z.string();

export const FullObjectParamsValidationSchema = BaseFullTaskParamsSchema.extend(
  partialObjectParamsShape,
);

export const ParamsValidationSchema = z.union([
  StringParamsKvpValidationSchema,
  FullObjectParamsValidationSchema,
]);

export const InjectVariablesTaskValidationSchema = z.object({
  [TaskName]: ParamsValidationSchema,
});

export type InjectVariablesTask = z.infer<
  typeof InjectVariablesTaskValidationSchema
>;
