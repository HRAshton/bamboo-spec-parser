import { z } from 'zod';
import { SubversionRepositoryValidationSchema } from './repositories.subversion.ts';

const BaseRegularRepositoryProperties = {
  'command-timeout-minutes': z.number().int().positive().optional(),
  lfs: z.boolean().optional(),
  'verbose-logs': z.boolean().optional(),
  'use-shallow-clones': z.boolean().optional(),
  'cache-on-agents': z.boolean().optional(),
  submodules: z.boolean().optional(),
  'fetch-all': z.boolean().optional(),
};

export const GitRepositoryParamsValidationSchema = z.object({
  ...BaseRegularRepositoryProperties,

  type: z.literal('git'),
  url: z.string(), // z.url() does not work with git+ssh urls
  branch: z.string(),
  'shared-credentials': z
    .union([
      z.string(),
      z.object({
        name: z.string(),
        scope: z.enum(['project', 'global']).optional(),
      }),
    ])
    .optional(),
  'ssh-key': z.string().optional(),
  'ssh-key-passphrase': z.string().optional(),
  'change-detection': z
    .object({
      'exclude-changeset-pattern': z.string().optional(),
      'file-filter-type': z.enum(['include_only', 'exclude']).optional(),
      'file-filter-pattern': z.string().optional(),
    })
    .optional(),
});

export const BitbucketCloudRepositoryParamsValidationSchema = z.object({
  ...BaseRegularRepositoryProperties,

  type: z.literal('bitbucket'),
  slug: z.string(),
  branch: z.string(),
  viewer: z.string().optional(),
});

export const GitHubRepositoryParamsValidationSchema = z.object({
  ...BaseRegularRepositoryProperties,

  type: z.literal('github'),
  repository: z.string(),
  branch: z.string(),
  user: z.string(),
  password: z.string(),
  viewer: z.string().optional(),
});

export const BitbucketServerRepositoryParamsValidationSchema = z.object({
  ...BaseRegularRepositoryProperties,

  type: z.literal('bitbucket-server'),
  server: z.string(),
  project: z.string(),
  slug: z.string(),
  'clone-url': z.string(),
  'public-key': z.string().optional(),
  'private-key': z.string().optional(),
  branch: z.string(),
  viewer: z.string().optional(),
});

const RegularRepositoryParamsSchema = z.discriminatedUnion('type', [
  GitRepositoryParamsValidationSchema,
  BitbucketCloudRepositoryParamsValidationSchema,
  GitHubRepositoryParamsValidationSchema,
  BitbucketServerRepositoryParamsValidationSchema,
]);

const RegularRepositorySchema = z.record(
  z.string(),
  RegularRepositoryParamsSchema,
);

export const StringValidationSchema = z.string();

export const KvpValidationSchema = z.record(
  z.string(),
  z.object({ scope: z.enum(['project', 'global']) }),
);

export const RepositoryReferenceValidationSchema = z.union([
  StringValidationSchema,
  KvpValidationSchema,
]);

export const RepositoryValidationSchema = z.union([
  RegularRepositorySchema,
  RepositoryReferenceValidationSchema,
  SubversionRepositoryValidationSchema,
]);

export type Repository = z.infer<typeof RepositoryValidationSchema>;
