import { z } from 'zod';

const ConcurrentBuildPluginValidationSchema = z.union([
  z.int().positive(),
  z.looseObject({}), // TODO: Revise
]);

export const OtherValidationSchema = z.object({
  'force-stop-build': z.boolean().optional(),
  'concurrent-build-plugin': ConcurrentBuildPluginValidationSchema.optional(),
  'all-other-apps': z.looseObject({}).optional(),
});

export type Other = z.infer<typeof OtherValidationSchema>;
