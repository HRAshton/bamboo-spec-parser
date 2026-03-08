import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
  parseAndExtendTaskTestCases,
} from '../../../helpers/test-helpers.ts';
import { CheckoutTaskValidationSchema } from './checkout.ts';

describe('CheckoutTaskSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseAndExtendTaskTestCases(`
      # simple default checkout
      - checkout

      # simple form with repository name
      - checkout: my repo

      # full form from plan task docs
      - checkout:
          repository: instructions
          path: my-path
          force-clean-build: false

      # full form from deployment docs
      - checkout:
          repository: instructions
          path: my-path
          force-clean-build: false

      # repository only (path defaults to working dir)
      - checkout:
          repository: instructions

      # path only (default repository)
      - checkout:
          path: custom/path

      # force-clean-build only
      - checkout:
          force-clean-build: true

      # empty object form is accepted by schema
      - checkout: {}
    `);

    it.each(testCases)(
      '%s',
      createSchemaAsserter(CheckoutTaskValidationSchema),
    );
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # wrong scalar type
      - checkout: 123

      # wrong task params type
      - checkout: []

      # wrong repository type
      - checkout:
          repository: 123

      # wrong path type
      - checkout:
          path: true

      # wrong force-clean-build type
      - checkout:
          force-clean-build: false-string

      # wrong conditions type
      - checkout:
          conditions: invalid

      # wrong description type
      - checkout:
          description: 999
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(CheckoutTaskValidationSchema),
    );
  });
});
