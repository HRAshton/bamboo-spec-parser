import { z } from 'zod';

export const RecipientValidationSchema = z.object({
  users: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  emails: z.array(z.email()).optional(),
  roles: z.array(z.enum(['anonymous', 'logged-in'])).optional(),
  responsible: z.boolean().optional(),
  watchers: z.boolean().optional(),
  committers: z.boolean().optional(),
});

export const RecipientsValidationSchema = z.union([
  z.object({
    users: z.array(z.string()).optional(),
    groups: z.array(z.string()).optional(),
    emails: z.array(z.email()).optional(),
    roles: z.array(z.enum(['anonymous', 'logged-in'])).optional(),
  }),
  z.enum(['responsible', 'watchers', 'committers']),
]);

export const EventValidationSchema = z.enum([
  'plan-failed',
  'plan-completed',
  'plan-status-changed',
  'plan-comment-added',
  'plan-responsibility-changed',
  'job-completed',
  'job-status-changed',
  'job-failed',
  'job-first-failed',
  'job-hung',
  'job-queue-timeout',
  'job-queued-without-capable-agents',
  'job-error',
]);

const ExtendedPlanFailedValidationSchema = z.object({
  'plan-failed': z.union([
    z.number().int().positive(),
    z.object({
      failures: z.number().int().positive(),
    }),
  ]),
});

const ExtendedJobErrorValidationSchema = z.object({
  'job-error': z.object({
    'first-only': z.boolean(),
  }),
});

export const EventWithModifiersValidationSchema = z.union([
  EventValidationSchema,
  ExtendedPlanFailedValidationSchema,
  ExtendedJobErrorValidationSchema,
]);

const FullRecipientsValidationSchema = z.union([
  RecipientValidationSchema,
  z.array(
    RecipientValidationSchema.or(
      z.enum(['responsible', 'watchers', 'committers']),
    ),
  ),
]);

export const NotificationValidationSchema = z.object({
  recipients: FullRecipientsValidationSchema,
  events: z.array(EventWithModifiersValidationSchema),
});

export type Notification = z.infer<typeof NotificationValidationSchema>;
