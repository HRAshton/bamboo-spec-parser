import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'test-parser' as const;

export const ParserTypeSchema = z.enum([
  'junit',
  'nunit',
  'testng',
  'mocha',
  'mstest',
]);

const commonProperties = {
  type: ParserTypeSchema,
  'test-results': z.union([z.string(), z.array(z.string())]).optional(),
  'ignore-time': z.boolean().optional(),
};

export const TaskParamsFullSchema = z
  .object(commonProperties)
  .extend(BaseFullTaskParamsSchema.shape);

export const TaskParamsSchema = z.union([
  ParserTypeSchema,
  TaskParamsFullSchema,
]);

export const TestParserTaskValidationSchema = z.object({
  [TaskName]: TaskParamsSchema,
});

export type TestParserTask = z.infer<typeof TestParserTaskValidationSchema>;
