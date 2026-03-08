import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { createSchemaAsserter } from '../../helpers/test-helpers.ts';
import { DependenciesValidationSchema } from './dependencies.ts';

describe('DependenciesValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      - {}

      -
        'require-all-stages-passing': true

      -
        'enabled-for-branches': false

      -
        'block-strategy': block_if_parent_failed

      -
        plans:
          - PROJ-PLAN-1
          - PROJ-PLAN-2

      -
        'require-all-stages-passing': true
        'enabled-for-branches': true
        'block-strategy': block_if_parent_unsuccessful
        plans:
          - PLAN-A
          - PLAN-B
      
      - 
        require-all-stages-passing: false
        enabled-for-branches: true
        block-strategy: none
        plans: []
    `).toJS();

    it.each(testCases)(
      '%s',
      createSchemaAsserter(DependenciesValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      -
        'require-all-stages-passing': 'yes'

      -
        'enabled-for-branches': 1

      -
        'block-strategy': invalid_strategy

      -
        plans: not-an-array

      -
        plans:
          - 123
          - true

      -
        'require-all-stages-passing': true
        'block-strategy': block_if_parent_failed
        plans: [PLAN1, 2]
    `).toJS();

    it.each(testCases)('%s', (testCase) => {
      expect(() => DependenciesValidationSchema.parse(testCase)).toThrow();
    });
  });
});
