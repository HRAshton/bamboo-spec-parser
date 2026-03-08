import { z } from 'zod';
import { ConditionsValidationSchema } from './conditions.ts';

const baseTaskParamsValidationShape = {
  description: z.string().optional(),
  conditions: ConditionsValidationSchema.optional(),
};

export const BaseFullTaskParamsSchema = z.object(baseTaskParamsValidationShape);
