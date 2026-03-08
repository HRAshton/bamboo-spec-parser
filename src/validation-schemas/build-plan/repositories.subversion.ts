import { z } from 'zod';
import { StringOrBooleanValidationSchema } from '../shared/shared-types.ts';

export const SubversionRepositoryServerConfigValidationSchema = z.object({
  'repository.svn.repositoryRoot': z.string(),

  'repository.svn.authType': z.string().optional(),
  'repository.svn.branch.create.autodetectPath':
    StringOrBooleanValidationSchema.optional(),
  'repository.svn.sslKeyFile': z.string().optional(),
  'repository.svn.sslPassphrase': z.string().optional(),
  'repository.svn.tag.create.autodetectPath':
    StringOrBooleanValidationSchema.optional(),
  'repository.svn.useExport': StringOrBooleanValidationSchema.optional(),
  'repository.svn.useExternals': StringOrBooleanValidationSchema.optional(),
  'repository.svn.username': z.string().optional(),
  'repository.svn.userPassword': z.string().optional(),
});

export const SubversionRepositoryBranchConfigValidationSchema = z.object({
  'repository.svn.branch.displayName': z.string().optional(),
  'repository.svn.branch.path': z.string().optional(),
});

export const SubversionRepositoryBranchDetectionValidationSchema = z.object({
  'repository.svn.branch.detection.path': z.string().optional(),
});

export const SubversionRepositoryChangeDetectionWithoutFilterTypeValidationSchema =
  z.object({
    'commit-isolation': z.boolean().optional(),
    'exclude-changeset-pattern': z.string().optional(),
  });

export const SubversionRepositoryChangeDetectionWithFilterTypeValidationSchema =
  SubversionRepositoryChangeDetectionWithoutFilterTypeValidationSchema.extend({
    'file-filter-type': z.enum(['include_only', 'exclude_all']).optional(),
    'file-filter-pattern': z.string().optional(),
  });

export const SubversionRepositoryChangeDetectionValidationSchema = z.union([
  SubversionRepositoryChangeDetectionWithFilterTypeValidationSchema,
  SubversionRepositoryChangeDetectionWithoutFilterTypeValidationSchema,
]);

export const SubversionRepositoryViewerGenericValidationSchema = z.record(
  z.literal('generic'),
  z.object({
    url: z.string(),
    'repository-path': z.string().optional(),
  }),
);

export const SubversionRepositoryViewerFisheyeValidationSchema = z.record(
  z.literal('fisheye'),
  z.object({
    url: z.string(),
    'repository-name': z.string(),
    path: z.string().optional(),
  }),
);

export const SubversionRepositoryViewerValidationSchema = z.union([
  SubversionRepositoryViewerGenericValidationSchema,
  SubversionRepositoryViewerFisheyeValidationSchema,
]);

export const SubversionRepositoryParamsValidationSchema = z.object({
  'plugin-key': z.literal(
    'com.atlassian.bamboo.plugin.system.repository:svnv2',
  ),
  'server-config': SubversionRepositoryServerConfigValidationSchema,
  'branch-config': SubversionRepositoryBranchConfigValidationSchema.optional(),
  'branch-detection-config':
    SubversionRepositoryBranchDetectionValidationSchema.optional(),
  'change-detection':
    SubversionRepositoryChangeDetectionValidationSchema.optional(),
  viewer: SubversionRepositoryViewerValidationSchema.optional(),
});

export const SubversionRepositoryValidationSchema = z.record(
  z.string(),
  SubversionRepositoryParamsValidationSchema,
);
