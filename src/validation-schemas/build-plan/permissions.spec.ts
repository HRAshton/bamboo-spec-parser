import { describe, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  createFailSchemaAsserter,
  createSchemaAsserter,
} from '../../helpers/test-helpers.ts';
import { PermissionsValidationSchema } from './permissions.ts';

describe('BuildPlanPermissionsPermissionsValidationSchema', () => {
  describe('Positive tests', () => {
    const testCases: unknown[] = parseDocument(`
      # permissions for users
      - users:
          - john
          - jane
        permissions:
          - view
          - build

      # permissions for groups
      - groups:
          - developers
          - testers
        permissions:
          - view
          - edit

      # permissions for roles
      - roles:
          - ROLE_ADMIN
          - ROLE_USER
        permissions:
          - admin

      # all permission types
      - permissions:
          - view
          - edit
          - build
          - clone
          - admin

      # combination of users, groups, and roles
      - users:
          - alice
        groups:
          - qa-team
        roles:
          - ROLE_DEVELOPER
        permissions:
          - view
          - build

      # single permission
      - permissions:
          - view

      # only permissions (no users/groups/roles)
      - permissions:
          - edit
          - build
    `).toJS();

    it.each(testCases)('%s', createSchemaAsserter(PermissionsValidationSchema));
  });

  describe('Negative tests', () => {
    const testCases: unknown[] = parseDocument(`
      # missing permissions array
      - users:
          - john

      # permissions is not array
      - permissions: view

      # invalid permission value
      - permissions:
          - view
          - invalid-permission

      # users is not array
      - users: john
        permissions:
          - view

      # users contains non-string
      - users:
          - john
          - 123
        permissions:
          - view

      # groups is not array
      - groups: developers
        permissions:
          - edit

      # groups contains non-string
      - groups:
          - developers
          - true
        permissions:
          - edit

      # roles is not array
      - roles: ROLE_ADMIN
        permissions:
          - admin

      # roles contains non-string
      - roles:
          - ROLE_ADMIN
          - 456
        permissions:
          - admin

      # permissions contains non-string
      - permissions:
          - view
          - 789
    `).toJS();

    it.each(testCases)(
      '%s',
      createFailSchemaAsserter(PermissionsValidationSchema),
    );
  });
});
