// Browser adapter. Re-export core utilities; avoid Node-only APIs.
import { readYaml } from './read-yaml.ts';
import {
  type BambooSpec,
  BambooSpecSchema,
} from './validation-schemas/bamboo-spec.ts';

export function parseAndValidateBambooSpecContent(
  specString: string,
): BambooSpec[] {
  const readingResult = readYaml(specString);
  return readingResult.map((doc) => BambooSpecSchema.parse(doc.toJS()));
}
