import { z } from 'zod';

const StringParamsValidationSchema = z.array(z.string().min(1));

const ObjectParamsValidationSchema = z.object({
  description: z.string().optional(),
  manual: z.boolean().optional(),
  final: z.boolean().optional(),
  jobs: z.array(z.string()),
});

const ParamsValidationSchema = z.union([
  StringParamsValidationSchema,
  ObjectParamsValidationSchema,
]);

export const StageValidationSchema = z.record(
  z.string(),
  ParamsValidationSchema,
);

export type Stage = z.infer<typeof StageValidationSchema>;
