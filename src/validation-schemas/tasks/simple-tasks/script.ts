import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'script' as const;

export const InterpreterSchema = z.enum([
  '/bin/sh',
  'cmd',
  'WINDOWS_POWER_SHELL',
  'SHELL',
]);

const commonProperties = {
  interpreter: InterpreterSchema.optional(),
  environment: z.string().optional(),
  'working-dir': z.string().optional(),
};

const InlineParamsShape = {
  ...commonProperties,
  scripts: z.union([z.string(), z.array(z.string())]),
};

const FileParamsShape = {
  ...commonProperties,
  file: z.string(),
  argument: z.string().optional(),
};

export const TaskParamsFullSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.object(InlineParamsShape).extend(BaseFullTaskParamsSchema.shape),
  z.object(FileParamsShape).extend(BaseFullTaskParamsSchema.shape),
]);

export const ScriptTaskValidationSchema = z.object({
  [TaskName]: TaskParamsFullSchema,
});

export type ScriptTask = z.infer<typeof ScriptTaskValidationSchema>;
