import { z } from 'zod';
import { BaseFullTaskParamsSchema } from '../base/task-base.ts';

export const TaskName = 'artifact-download' as const;

const artifactSpecificationShape = {
  name: z.string().optional(),
  destination: z.string().optional(),
};

const ArtifactSpecificationSchema = z.object(artifactSpecificationShape);

const partialObjectParamsShape = {
  'source-plan': z.string().optional(),
  'custom-branch': z.string().optional(),
  artifacts: z.array(ArtifactSpecificationSchema).optional(),
};

export const TaskParamsSchema = BaseFullTaskParamsSchema.extend({
  // Originally, it should contain only one set of properties, but Zod doesn't support unions in this case
  ...partialObjectParamsShape,
  ...artifactSpecificationShape,
}).refine(
  (data) => {
    const hasArtifactProperties =
      data.name !== undefined || data.destination !== undefined;
    const hasObjectProperties = Object.keys(partialObjectParamsShape).some(
      (key) => key in data,
    );
    return !(hasArtifactProperties && hasObjectProperties);
  },
  {
    message:
      'Task parameters must be either a full object with source-plan, custom-branch, and artifacts,' +
      ' or a simple artifact specification with name and/or destination, but not both.',
  },
);

export const TaskFullSchema = z.object({
  [TaskName]: TaskParamsSchema,
});

export const ArtifactDownloadTaskValidationSchema = z.union([
  z.literal(TaskName),
  TaskFullSchema,
]);

export type ArtifactDownloadTask = z.infer<
  typeof ArtifactDownloadTaskValidationSchema
>;
