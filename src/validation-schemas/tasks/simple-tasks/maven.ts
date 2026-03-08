import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'maven' as const;

const parametersShape = {
  executable: z.string(),
  jdk: z.string(),
  goal: z.string(),
  tests: z.union([z.literal(false), z.string()]).optional(),
  environment: z.string().optional(),
  'working-dir': z.string().optional(),
  'project-file': z.string().optional(),
  'use-return-code': z.boolean().optional(),
};

export const TaskParamsFullSchema = z
  .object(parametersShape)
  .extend(BaseFullTaskParamsSchema.shape);

export const MavenTaskValidationSchema = z.object({
  [TaskName]: TaskParamsFullSchema,
});

export type MavenTask = z.infer<typeof MavenTaskValidationSchema>;
