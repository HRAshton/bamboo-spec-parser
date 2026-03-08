import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { RequirementValidationSchema } from './requirements.ts';

describe('Requirements', () => {
  const testCases: unknown[] = parseDocument(`
    - hasDocker
    - system.builder.command.Python 3

    - javaVersion: 1.8
    - system.builder.command.Node 14: true

    - os: Ubuntu \\d
    - system.builder.command.Go 1.16: .*path$
  `).toJS();

  it.each(testCases)('%s', (testCase) => {
    const result = RequirementValidationSchema.parse(testCase);
    expect(result).toStrictEqual(testCase);
  });
});
