import { z } from 'zod';

export const VariablesValidationSchema = z.record(z.string(), z.string());

export type Variables = z.infer<typeof VariablesValidationSchema>;
