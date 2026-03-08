// Node/Bun adapter. Exposes core utilities and Node-specific helpers.
import fs from 'node:fs';
import path from 'node:path';
import { readYaml } from './read-yaml.ts';
import { type BambooSpec, BambooSpecSchema } from './validation-schemas/bamboo-spec.ts';

const readFile = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf-8');
};

const makeIncludeProvider = (baseDir: string) => {
  return (requiredPath: string): string => {
    const resolved = path.resolve(baseDir, requiredPath);
    return readFile(resolved);
  };
};

export function parseAndValidateBambooSpecContent(
  specString: string,
): BambooSpec[] {
  const readingResult = readYaml(specString);
  return readingResult.map((doc) => BambooSpecSchema.parse(doc.toJS()));
}

export function parseAndValidateBambooSpecFile(yamlPath: string): BambooSpec[] {
  const specString = readFile(yamlPath);
  const baseDir = path.dirname(path.resolve(yamlPath));
  const readingResult = readYaml(specString, makeIncludeProvider(baseDir));
  return readingResult.map((doc) => BambooSpecSchema.parse(doc.toJS()));
}
