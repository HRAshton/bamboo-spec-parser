import { z } from 'zod';

export const StringValidationSchema = z.string().min(1);

export const KvpValidationSchema = z
  .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
  .refine((obj) => Object.keys(obj).length === 1, {
    message: 'Object must have exactly one key-value pair',
  });

export const RequirementValidationSchema = z.union([
  StringValidationSchema,
  KvpValidationSchema,
]);

export type Requirement = z.infer<typeof RequirementValidationSchema>;
