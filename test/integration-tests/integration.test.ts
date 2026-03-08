import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { parseAndValidateBambooSpecFile } from '../../src';

describe('Integration Tests', () => {
  describe('Examples from Docs', () => {
    it('should parse Build Plan', () => {
      const specPath =
        'test/integration-tests/fixtures/from-docs/build-plan.yaml';
      const parsingResult = parseAndValidateBambooSpecFile(specPath);
      expect(parsingResult).toBeDefined();

      const rawContent = fs.readFileSync(specPath, 'utf-8');
      const rawSpec = parseDocument(rawContent).toJS();
      expect(parsingResult[0]).toStrictEqual(rawSpec);
    });

    it('should parse Deployment Project', () => {
      const specPath =
        'test/integration-tests/fixtures/from-docs/deployment-project.yaml';
      const parsingResult = parseAndValidateBambooSpecFile(specPath);
      expect(parsingResult).toBeDefined();

      const rawContent = fs.readFileSync(specPath, 'utf-8');
      const rawSpec = parseDocument(rawContent).toJS();
      expect(parsingResult[0]).toStrictEqual(rawSpec);
    });

    it('should parse Build Plan Permissions', () => {
      const specPath =
        'test/integration-tests/fixtures/from-docs/build-plan-permissions.yaml';
      const parsingResult = parseAndValidateBambooSpecFile(specPath);
      expect(parsingResult).toBeDefined();

      const rawContent = fs.readFileSync(specPath, 'utf-8');
      const rawSpec = parseDocument(rawContent).toJS();
      expect(parsingResult[0]).toStrictEqual(rawSpec);
    });

    it('should parse Deployment Project Permissions', () => {
      const specPath =
        'test/integration-tests/fixtures/from-docs/deployment-project-permissions.yaml';
      const parsingResult = parseAndValidateBambooSpecFile(specPath);
      expect(parsingResult).toBeDefined();

      const rawContent = fs.readFileSync(specPath, 'utf-8');
      const rawSpec = parseDocument(rawContent).toJS();
      expect(parsingResult[0]).toStrictEqual(rawSpec);
    });
  });

  describe('Docker Tests', () => {
    it('should parse Build Plan with Docker', () => {
      const specPath =
        'test/integration-tests/fixtures/build-plan-with-docker-tasks.yaml';
      const parsingResult = parseAndValidateBambooSpecFile(specPath);
      expect(parsingResult).toBeDefined();

      const rawContent = fs.readFileSync(specPath, 'utf-8');
      const rawSpec = parseDocument(rawContent).toJS();
      expect(parsingResult[0]).toStrictEqual(rawSpec);
    });
  });
});
