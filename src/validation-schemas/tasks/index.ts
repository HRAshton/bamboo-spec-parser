import { z } from 'zod';
import { type AnyTaskTask, AnyTaskTaskValidationSchema } from './any-task';
import {
  type ArtifactDownloadTask,
  ArtifactDownloadTaskValidationSchema,
} from './simple-tasks/artifact-download';
import {
  type CheckoutTask,
  CheckoutTaskValidationSchema,
} from './simple-tasks/checkout';
import {
  type CleanTask,
  CleanTaskValidationSchema,
} from './simple-tasks/clean';
import {
  type InjectVariablesTask,
  InjectVariablesTaskValidationSchema,
} from './simple-tasks/inject-variables';
import {
  type MavenTask,
  MavenTaskValidationSchema,
} from './simple-tasks/maven';
import {
  type ScriptTask,
  ScriptTaskValidationSchema,
} from './simple-tasks/script';
import {
  type TestParserTask,
  TestParserTaskValidationSchema,
} from './simple-tasks/test-parser';
import {
  type VcsBranchTask,
  VcsBranchTaskValidationSchema,
} from './simple-tasks/vcs-branch';
import {
  type VcsCommitTask,
  VcsCommitTaskValidationSchema,
} from './simple-tasks/vcs-commit';
import {
  type VcsPushTask,
  VcsPushTaskValidationSchema,
} from './simple-tasks/vcs-push';
import {
  type VcsTagTask,
  VcsTagTaskValidationSchema,
} from './simple-tasks/vcs-tag';

export const TasksValidationSchema = z.union([
  ArtifactDownloadTaskValidationSchema,
  CheckoutTaskValidationSchema,
  CleanTaskValidationSchema,
  InjectVariablesTaskValidationSchema,
  MavenTaskValidationSchema,
  ScriptTaskValidationSchema,
  TestParserTaskValidationSchema,
  VcsBranchTaskValidationSchema,
  VcsCommitTaskValidationSchema,
  VcsPushTaskValidationSchema,
  VcsTagTaskValidationSchema,
  AnyTaskTaskValidationSchema,
]);

export type Task = z.infer<typeof TasksValidationSchema>;

export type { CleanTask };
export type { ArtifactDownloadTask };
export type { CheckoutTask };
export type { InjectVariablesTask };
export type { MavenTask };
export type { ScriptTask };
export type { TestParserTask };
export type { VcsBranchTask };
export type { VcsCommitTask };
export type { VcsPushTask };
export type { VcsTagTask };
export type { AnyTaskTask };
