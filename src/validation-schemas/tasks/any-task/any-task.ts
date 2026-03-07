import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';
import { DockerTaskParamsValidationSchema } from './task-docker-cli';

export const TaskName = 'any-task' as const;

// Each of these should be BaseFullTaskParamsSchema
export const StaticParamsValidationSchema = z.discriminatedUnion('plugin-key', [
  DockerTaskParamsValidationSchema,
]);

export const DynamicAnyTaskParamsValidationSchema =
  BaseFullTaskParamsSchema.extend({
    'plugin-key': z.string(),
    configuration: z.record(z.string(), z.unknown()),
  });

export const AnyTaskParamsValidationSchema = z.union([
  StaticParamsValidationSchema,
  DynamicAnyTaskParamsValidationSchema,
]);

export const AnyTaskTaskValidationSchema = z.object({
  [TaskName]: AnyTaskParamsValidationSchema,
});

export type AnyTaskTask = z.infer<typeof AnyTaskTaskValidationSchema>;
