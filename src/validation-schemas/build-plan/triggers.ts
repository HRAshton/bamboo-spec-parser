import { z } from 'zod';

export const PollingTriggerIntParamValidationSchema = z
  .number()
  .int()
  .positive();

export const PollingTriggerObjectParamValidationSchema = z.object({
  period: z.number().int().positive().optional(),
  cron: z.string().optional(),
  repositories: z.array(z.string()).optional(),
  conditions: z
    .array(
      z
        .object({
          'green-plan': z.array(z.string()).optional(),
          'all-other-conditions': z
            .record(z.string(), z.union([z.string(), z.boolean()]))
            .optional(),
        })
        .or(z.record(z.string(), z.any())),
    )
    .optional(),
});

export const PollingTriggerParamsValidationSchema = z.union([
  PollingTriggerIntParamValidationSchema,
  PollingTriggerObjectParamValidationSchema,
]);

export const PollingTriggerValidationSchema = z.record(
  z.literal('polling'),
  PollingTriggerParamsValidationSchema,
);

export const CronTriggerParamsValidationSchema = z.union([
  z.string(),
  z.object({
    expression: z.string(),
  }),
]);

export const CronTriggerValidationSchema = z.record(
  z.literal('cron'),
  CronTriggerParamsValidationSchema,
);

export const RemoteTriggerParamsValidationSchema = z.union([
  z.boolean(),
  z.ipv4(),
  z.ipv6(),
  z.object({
    ip: z.union([z.ipv4(), z.ipv6()]),
  }),
]);

export const RemoteTriggerValidationSchema = z.union([
  z.literal('remote'),
  z.record(z.literal('remote'), RemoteTriggerParamsValidationSchema),
]);

export const TriggerValidationSchema = z.union([
  PollingTriggerValidationSchema,
  CronTriggerValidationSchema,
  RemoteTriggerValidationSchema,
]);

export type Trigger = z.infer<typeof TriggerValidationSchema>;
