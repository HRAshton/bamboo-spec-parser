import { z } from 'zod';

export const StringValidationSchema = z.string();

export const ObjectValidationSchema = z.object({
  image: z.string(),
  volumes: z.record(z.string(), z.string()).optional(),
  'use-default-volumes': z.boolean().optional(),
  'docker-run-arguments': z.array(z.string()).optional(),
});

export const DockerValidationSchema = z.union([
  StringValidationSchema,
  ObjectValidationSchema,
]);

export type Docker = z.infer<typeof DockerValidationSchema>;
