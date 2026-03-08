import { describe, expect, it } from 'vitest';
import { readYaml } from './read-yaml.ts';

describe('readYaml', () => {
  describe('Positive tests - single document', () => {
    it('parses simple YAML document', () => {
      const yaml = `
version: 2
plan:
  project-key: TEST
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      expect(result[0].toJS()).toEqual({
        version: 2,
        plan: { 'project-key': 'TEST' },
      });
    });

    it('parses document with arrays', () => {
      const yaml = `
version: 2
items:
  - name: item1
  - name: item2
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.items).toHaveLength(2);
    });

    it('parses document with nested objects', () => {
      const yaml = `
version: 2
deployment:
  name: My Deployment
  source-plan: PLAN-KEY
release-naming:
  next-version-name: release-1.0
  auto-increment: true
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.deployment.name).toBe('My Deployment');
      expect(parsed['release-naming']['auto-increment']).toBe(true);
    });

    it('parses document with special characters in strings', () => {
      const yaml = `
version: 2
script: |
  #!/bin/bash
  echo "Hello World"
  npm install
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.script).toContain('#!/bin/bash');
    });

    it('parses document with numbers and booleans', () => {
      const yaml = `
version: 2
count: 42
enabled: true
disabled: false
timeout: 60.5
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.count).toBe(42);
      expect(parsed.enabled).toBe(true);
      expect(parsed.disabled).toBe(false);
      expect(parsed.timeout).toBe(60.5);
    });

    it('parses empty document', () => {
      const yaml = `---`;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
    });

    it('parses document with null values', () => {
      const yaml = `
version: 2
nullable: null
items:
  - name: item1
    value: null
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.nullable).toBeNull();
    });
  });

  describe('Positive tests - multiple documents', () => {
    it('parses multiple YAML documents', () => {
      const yaml = `
---
version: 2
doc: first
---
version: 2
doc: second
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(2);
      expect(result[0].toJS().doc).toBe('first');
      expect(result[1].toJS().doc).toBe('second');
    });

    it('parses three documents in sequence', () => {
      const yaml = `
---
type: plan
---
type: deployment
---
type: permissions
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(3);
      expect(result[0].toJS().type).toBe('plan');
      expect(result[1].toJS().type).toBe('deployment');
      expect(result[2].toJS().type).toBe('permissions');
    });

    it('parses documents with different structures', () => {
      const yaml = `
---
version: 2
plan:
  key: PLAN1
  name: Plan One
---
version: 2
deployment:
  name: Deploy One
      `;
      const result = readYaml(yaml);
      expect(result).toHaveLength(2);
      expect(result[0].toJS().plan).toBeDefined();
      expect(result[1].toJS().deployment).toBeDefined();
    });
  });

  describe('Positive tests - include tag', () => {
    it('processes !include tag with provider', () => {
      const mainYaml = `
        version: 2
        plan:
          key: MAIN
        job: !include 'other.yaml'
      `;
      const providerMock = (path: string) => {
        if (path === 'other.yaml') {
          return `
            name: Test Job
            tasks:
              - script: echo hello
          `;
        }
        throw new Error(`Unknown path: ${path}`);
      };

      const result = readYaml(mainYaml, providerMock);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.job.name).toBe('Test Job');
      expect(parsed.job.tasks).toHaveLength(1);
    });

    it('processes nested !include tags', () => {
      const mainYaml = `
        version: 2
        content: !include 'config.yaml'
      `;
      const providerMock = (path: string) => {
        if (path === 'config.yaml') {
          return `
            name: Config
            value: included
          `;
        }
        throw new Error(`Unknown path: ${path}`);
      };

      const result = readYaml(mainYaml, providerMock);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.content.value).toBe('included');
    });
  });

  describe('Negative tests - YAML syntax errors', () => {
    it('throws on invalid YAML syntax', () => {
      const yaml = `
        version: 2
        plan
          key: PLAN1
      `;
      expect(() => readYaml(yaml)).toThrow();
    });

    it('throws on invalid indentation', () => {
      const yaml = `
        version: 2
        plan:
           key: PLAN1
          name: Test
      `;
      expect(() => readYaml(yaml)).toThrow();
    });

    it('throws on unclosed quote', () => {
      const yaml = `
        version: 2
        message: "unclosed
      `;
      expect(() => readYaml(yaml)).toThrow();
    });

    it('throws on invalid array syntax', () => {
      const yaml = `
        version: 2
        items:
          - name: item1
          name: item2
      `;
      expect(() => readYaml(yaml)).toThrow();
    });

    it('throws on duplicate keys at root level', () => {
      const yaml = `
        version: 2
        key: value1
        key: value2
      `;

      expect(() => readYaml(yaml)).toThrow();
    });
  });

  describe('Negative tests - include tag errors', () => {
    it('throws when !include used without provider', () => {
      const yaml = `
        version: 2
        job: !include 'other.yaml'
      `;
      expect(() => readYaml(yaml)).toThrow(
        '!include tag used but no provider function was given',
      );
    });

    it('throws when include provider returns multi-document YAML', () => {
      const mainYaml = `
version: 2
job: !include 'multi.yaml'
      `;
      const providerMock = (path: string) => {
        if (path === 'multi.yaml') {
          return `
---
name: doc1
---
name: doc2
          `;
        }
        throw new Error(`Unknown path: ${path}`);
      };

      expect(() => readYaml(mainYaml, providerMock)).toThrow(
        '!include supports single-document YAML only',
      );
    });

    it('throws when include provider throws error', () => {
      const mainYaml = `
version: 2
job: !include 'missing.yaml'
      `;
      const providerMock = (path: string) => {
        throw new Error(`File not found: ${path}`);
      };

      expect(() => readYaml(mainYaml, providerMock)).toThrow(
        'File not found: missing.yaml',
      );
    });

    it('throws when include path references non-existent file', () => {
      const mainYaml = `
version: 2
job: !include 'nonexistent.yaml'
      `;
      const providerMock = (path: string) => {
        if (path === 'nonexistent.yaml') {
          throw new Error(`File not found: ${path}`);
        }
        throw new Error(`Unknown path: ${path}`);
      };

      expect(() => readYaml(mainYaml, providerMock)).toThrow(
        'File not found: nonexistent.yaml',
      );
    });
  });

  describe('Negative tests - parsing error reporting', () => {
    it('includes document index in error message', () => {
      const yaml = `
---
version: 2
valid: doc
---
version: 2
invalid: {
      `;
      try {
        readYaml(yaml);
        expect.fail('Should have thrown error');
      } catch (error: unknown) {
        const message = (error as Error).message;
        expect(message).toContain('Document #1');
        expect(message).toContain('failed to parse');
      }
    });

    it('accumulates errors from multiple invalid documents', () => {
      const yaml = `
---
invalid1: {
---
version: 2
---
invalid2: [
      `;
      try {
        readYaml(yaml);
        expect.fail('Should have thrown error');
      } catch (error: unknown) {
        const message = (error as Error).message;
        expect(message).toContain('error(s)');
      }
    });
  });

  describe('Edge cases', () => {
    it('handles YAML with comments', () => {
      const yaml = `# Header comment
version: 2
# Mid comment
plan:
  key: TEST
# Footer comment`;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.version).toBe(2);
    });

    it('handles YAML with unicode characters', () => {
      const yaml = `version: 2
message: "Hello 世界 🌍"
description: "Тест мира"`;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.message).toContain('世界');
      expect(parsed.description).toContain('Тест');
    });

    it('handles YAML with very long strings', () => {
      const longString = 'a'.repeat(10000);
      const yaml = `version: 2
content: "${longString}"`;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.content).toHaveLength(10000);
    });

    it('handles YAML with deeply nested objects', () => {
      const yaml = `version: 2
level1:
  level2:
    level3:
      level4:
        level5:
          value: deep`;
      const result = readYaml(yaml);
      expect(result).toHaveLength(1);
      const parsed = result[0].toJS();
      expect(parsed.level1.level2.level3.level4.level5.value).toBe('deep');
    });
  });
});
