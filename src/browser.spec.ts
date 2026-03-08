import { describe, expect, it } from 'vitest';
import { parseAndValidateBambooSpecContent } from './browser.ts';
import type { BuildPlanSpec } from './validation-schemas/build-plan-spec.ts';

describe('parseAndValidateBambooSpecContent (Browser)', () => {
  describe('Positive tests - valid specs', () => {
    it('parses minimal build plan', () => {
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
      const result = parseAndValidateBambooSpecContent(yaml);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDefined();
      expect('plan' in result[0]).toBe(true);
    });

    it('parses minimal deployment project', () => {
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
      const result = parseAndValidateBambooSpecContent(yaml);
      expect(result).toHaveLength(1);
      expect(result[0]).toBeDefined();
      expect('deployment' in result[0]).toBe(true);
    });

    it('parses multiple documents', () => {
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
    - script: echo 1
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
    - script: echo 2`;
      const result = parseAndValidateBambooSpecContent(yaml);
      expect(result).toHaveLength(2);
      expect((result[0] as BuildPlanSpec).plan.key).toBe('PLAN1');
      expect((result[1] as BuildPlanSpec).plan.key).toBe('PLAN2');
    });

    it('returns array of BambooSpec objects', () => {
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
      const result = parseAndValidateBambooSpecContent(yaml);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('version');
      expect(result[0]).toHaveProperty('plan');
    });
  });

  describe('Negative tests - invalid specifications', () => {
    it('throws on missing version', () => {
      const yaml = `plan:
  project-key: TEST
  key: PLAN1
  name: Invalid Plan`;
      expect(() => parseAndValidateBambooSpecContent(yaml)).toThrow();
    });

    it('throws on invalid version', () => {
      const yaml = `version: 1
plan:
  project-key: TEST
  key: PLAN1
  name: Invalid Plan`;
      expect(() => parseAndValidateBambooSpecContent(yaml)).toThrow();
    });

    it('throws on missing plan required fields', () => {
      const yaml = `version: 2
plan:
  project-key: TEST`;
      expect(() => parseAndValidateBambooSpecContent(yaml)).toThrow();
    });

    it('throws on malformed YAML', () => {
      const yaml = `version: 2
plan
  key: invalid`;
      expect(() => parseAndValidateBambooSpecContent(yaml)).toThrow();
    });
  });

  describe('Edge cases', () => {
    it('parses plan with unicode characters', () => {
      const yaml = `version: 2
plan:
  project-key: TEST
  key: PLAN1
  name: Plan with Unicode 中文
stages:
  - Build:
      jobs:
        - Default
Default:
  tasks:
    - script: echo hello`;
      const result = parseAndValidateBambooSpecContent(yaml);
      expect(result).toHaveLength(1);
      expect((result[0] as BuildPlanSpec).plan.name).toContain('中文');
    });
  });
});
