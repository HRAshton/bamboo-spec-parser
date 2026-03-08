// Node/Bun adapter. Exposes core utilities and Node-specific helpers.
import fs from 'node:fs';
import { readYaml } from './read-yaml.ts';
import {
  type BambooSpec,
  BambooSpecSchema,
} from './validation-schemas/bamboo-spec.ts';

const getContent = (requiredPath: string): string => {
  return fs.readFileSync(requiredPath, 'utf-8');
};

export function parseAndValidateBambooSpecContent(
  specString: string,
): BambooSpec[] {
  const readingResult = readYaml(specString, getContent);
  return readingResult.map((doc) => BambooSpecSchema.parse(doc.toJS()));
}

export function parseAndValidateBambooSpecFile(yamlPath: string): BambooSpec[] {
  const specString = getContent(yamlPath);
  return parseAndValidateBambooSpecContent(specString);
}
