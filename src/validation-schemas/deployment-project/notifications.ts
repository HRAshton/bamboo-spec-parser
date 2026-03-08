import { z } from 'zod';

export const WebhookNameValidationSchema = z.enum([
  'Build webhook',
  'Deploy webhook',
]);

export const RecipientValidationSchema = z.object({
  users: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  emails: z.array(z.email()).optional(),
  webhook: z
    .object({
      name: WebhookNameValidationSchema,
      url: z.url(),
    })
    .optional(),
});

export const EventValidationSchema = z.enum([
  'deployment-started-and-finished',
  'deployment-failed',
  'deployment-finished',
]);

const DeploymentNotificationEventsValidationSchema = z.union([
  EventValidationSchema,
  z.array(EventValidationSchema),
]);

export const DeploymentNotificationValidationSchema = z.object({
  events: DeploymentNotificationEventsValidationSchema,
  recipients: z.array(RecipientValidationSchema),
});

export type DeploymentNotification = z.infer<
  typeof DeploymentNotificationValidationSchema
>;
