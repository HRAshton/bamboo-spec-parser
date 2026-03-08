import { z } from 'zod';

export const StringOrBooleanValidationSchema = z.union([
  z.string(),
  z.boolean(),
]);

export const StringOrNumberValidationSchema = z.union([
  z.stringFormat('numeric', /^\d+$/),
  z.number(),
]);
