import { z } from 'zod';

export const ArtifactValidationSchema = z.object({
  name: z.string(),
  pattern: z.string(),
  location: z.string().optional(),
  required: z.boolean().optional(),
  shared: z.boolean().optional(),
});

export type Artifact = z.infer<typeof ArtifactValidationSchema>;
