import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  parseAndValidateBambooSpecFile,
  parseAndValidateBambooSpecContent,
} from './index.ts';
import type { BuildPlanSpec } from './validation-schemas/build-plan-spec.ts';
import type { DeploymentProjectSpec } from './validation-schemas/deployment-project-spec.ts';

describe('parseAndValidateBambooSpecFile (Node/File)', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bamboo-spec-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Positive tests - file reading', () => {
    it('reads and parses a valid build plan from file', () => {
      const yaml = `version: 2
plan:
  project-key: TEST
  key: PLAN1
  name: Test Plan
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello`;
      const filePath = path.join(tempDir, 'test-plan.yaml');
      fs.writeFileSync(filePath, yaml);

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(result).toHaveLength(1);
      expect((result[0] as BuildPlanSpec).plan).toBeDefined();
      expect((result[0] as BuildPlanSpec).plan['project-key']).toBe('TEST');
    });

    it('reads and parses deployment project from file', () => {
      const yaml = `version: 2
deployment:
  name: My Deployment
  source-plan: BUILD-PLAN
release-naming:
  next-version-name: release-1.0
environments:
  - QA
QA:
  tasks:
    - script: echo deploying`;
      const filePath = path.join(tempDir, 'deployment.yaml');
      fs.writeFileSync(filePath, yaml);

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(result).toHaveLength(1);
      expect((result[0] as DeploymentProjectSpec).deployment).toBeDefined();
      expect((result[0] as DeploymentProjectSpec).deployment.name).toBe(
        'My Deployment',
      );
    });

    it('reads file with UTF-8 encoding', () => {
      const yaml = `version: 2
plan:
  project-key: TEST
  key: PLAN1
  name: Test Plan with Unicode 中文 🚀
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello`;
      const filePath = path.join(tempDir, 'unicode.yaml');
      fs.writeFileSync(filePath, yaml, 'utf-8');

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(result).toHaveLength(1);
      expect((result[0] as BuildPlanSpec).plan.name).toContain('中文');
    });

    it('reads file with multiple documents', () => {
      const yaml = `---
version: 2
plan:
  project-key: TEST
  key: PLAN1
  name: Plan One
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello
---
version: 2
plan:
  project-key: TEST
  key: PLAN2
  name: Plan Two
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello`;
      const filePath = path.join(tempDir, 'multi-doc.yaml');
      fs.writeFileSync(filePath, yaml);

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(result).toHaveLength(2);
      expect((result[0] as BuildPlanSpec).plan.key).toBe('PLAN1');
      expect((result[1] as BuildPlanSpec).plan.key).toBe('PLAN2');
    });
  });

  describe('Negative tests - file reading errors', () => {
    it('throws when file does not exist', () => {
      const filePath = path.join(tempDir, 'nonexistent.yaml');
      expect(() => parseAndValidateBambooSpecFile(filePath)).toThrow();
    });

    it('throws when file contains invalid YAML syntax', () => {
      const yaml = `version: 2
plan
  key PLAN1
  name: Invalid`;
      const filePath = path.join(tempDir, 'invalid-yaml.yaml');
      fs.writeFileSync(filePath, yaml);

      expect(() => parseAndValidateBambooSpecFile(filePath)).toThrow();
    });

    it('throws when spec is invalid', () => {
      const yaml = `version: 2
plan:
  project-key: TEST`;
      const filePath = path.join(tempDir, 'invalid-spec.yaml');
      fs.writeFileSync(filePath, yaml);

      expect(() => parseAndValidateBambooSpecFile(filePath)).toThrow();
    });

    it('throws when version is missing', () => {
      const yaml = `plan:
  project-key: TEST
  key: PLAN1
  name: No Version Plan`;
      const filePath = path.join(tempDir, 'no-version.yaml');
      fs.writeFileSync(filePath, yaml);

      expect(() => parseAndValidateBambooSpecFile(filePath)).toThrow();
    });

    it('throws when version is invalid', () => {
      const yaml = `version: 3
plan:
  project-key: TEST
  key: PLAN1
  name: Invalid Version Plan`;
      const filePath = path.join(tempDir, 'bad-version.yaml');
      fs.writeFileSync(filePath, yaml);

      expect(() => parseAndValidateBambooSpecFile(filePath)).toThrow();
    });
  });

  describe('Edge cases', () => {
    it('parses file with Windows line endings (CRLF)', () => {
      const yaml =
        'version: 2\r\nplan:\r\n  project-key: TEST\r\n  key: PLAN1\r\n  name: Windows Plan\r\nstages:\r\n  - Build:\r\n      jobs:\r\n        - Default\r\nDefault:\r\n  tasks:\r\n    - script: echo hello';
      const filePath = path.join(tempDir, 'windows.yaml');
      fs.writeFileSync(filePath, yaml);

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(result).toHaveLength(1);
      expect((result[0] as BuildPlanSpec).plan['project-key']).toBe('TEST');
    });

    it('parses file with Unix line endings (LF)', () => {
      const yaml =
        'version: 2\nplan:\n  project-key: TEST\n  key: PLAN1\n  name: Unix Plan\nstages:\n  - Build:\n      jobs:\n        - Default\nDefault:\n  tasks:\n    - script: echo hello';
      const filePath = path.join(tempDir, 'unix.yaml');
      fs.writeFileSync(filePath, yaml);

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(result).toHaveLength(1);
      expect((result[0] as BuildPlanSpec).plan.name).toBe('Unix Plan');
    });

    it('parses file with comments', () => {
      const yaml = `# Main plan definition
version: 2
# Plan configuration
plan:
  project-key: TEST  # Project key
  key: PLAN1         # Plan key
  name: Plan with Comments
# Build stage
stages:
  - Build:
      jobs:
        - Default
# Default job
Default:
  tasks:
    # Script task
    - script: echo hello  # Echo command`;
      const filePath = path.join(tempDir, 'comments.yaml');
      fs.writeFileSync(filePath, yaml);

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(result).toHaveLength(1);
      expect((result[0] as BuildPlanSpec).plan.key).toBe('PLAN1');
    });

    it('returns array of BambooSpec objects from file', () => {
      const yaml = `version: 2
plan:
  project-key: TEST
  key: PLAN1
  name: Test Plan
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello`;
      const filePath = path.join(tempDir, 'result.yaml');
      fs.writeFileSync(filePath, yaml);

      const result = parseAndValidateBambooSpecFile(filePath);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('version');
      expect(result[0]).toHaveProperty('plan');
    });
  });
});

describe('parseAndValidateBambooSpecContent (Node/String)', () => {
  it('parses a valid build plan from string', () => {
    const yaml = `version: 2
plan:
  project-key: STR
  key: PLAN1
  name: String Plan
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello`;

    const result = parseAndValidateBambooSpecContent(yaml);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('plan');
    expect((result[0] as any).plan['project-key']).toBe('STR');
  });

  it('parses multiple documents from string', () => {
    const yaml = `---
version: 2
plan:
  project-key: STR
  key: PLAN1
  name: First
---
version: 2
plan:
  project-key: STR
  key: PLAN2
  name: Second`;

    const result = parseAndValidateBambooSpecContent(yaml);
    expect(result).toHaveLength(2);
    expect((result[0] as any).plan.key).toBe('PLAN1');
    expect((result[1] as any).plan.key).toBe('PLAN2');
  });

  it('throws on invalid YAML syntax', () => {
    const yaml = `version: 2
plan
  key: BAD`;
    expect(() => parseAndValidateBambooSpecContent(yaml)).toThrow();
  });

  it('throws when spec is invalid according to schema', () => {
    const yaml = `version: 2
plan:
  project-key: MISSING_KEY`;
    expect(() => parseAndValidateBambooSpecContent(yaml)).toThrow();
  });

  it('parses string with UTF-8 characters', () => {
    const yaml = `version: 2
plan:
  project-key: UTF
  key: PLANU
  name: Unicode Plan 中文 🚀
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello`;
    const result = parseAndValidateBambooSpecContent(yaml);
    expect(result).toHaveLength(1);
    expect((result[0] as any).plan.name).toContain('中文');
  });

  it('parses string with Windows CRLF line endings', () => {
    const yaml =
      'version: 2\r\nplan:\r\n  project-key: CRLF\r\n  key: PLAN1\r\n  name: CRLF Plan\r\nstages:\r\n  - Build:\r\n      jobs:\r\n        - Default\r\nDefault:\r\n  tasks:\r\n    - script: echo hi';
    const result = parseAndValidateBambooSpecContent(yaml);
    expect(result).toHaveLength(1);
    expect((result[0] as any).plan['project-key']).toBe('CRLF');
  });
});
