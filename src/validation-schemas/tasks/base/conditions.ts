import { z } from 'zod';

export const EqualsConditionValidationSchema = z.object({
  equals: z.record(z.string(), z.string()),
});

export const NotEqualsConditionValidationSchema = z.object({
  'not-equals': z.record(z.string(), z.string()),
});

export const MatchesConditionValidationSchema = z.object({
  matches: z.record(z.string(), z.string()),
});

export const ExistsConditionValidationSchema = z.object({
  exists: z.string(),
});

export const NotExistsConditionValidationSchema = z.object({
  'not-exists': z.string(),
});

export const VariableConditionValidationSchema = z.union([
  EqualsConditionValidationSchema,
  NotEqualsConditionValidationSchema,
  MatchesConditionValidationSchema,
  ExistsConditionValidationSchema,
  NotExistsConditionValidationSchema,
]);

export const ConditionsValidationSchema = z.array(
  z.object({
    variable: VariableConditionValidationSchema,
  }),
);
