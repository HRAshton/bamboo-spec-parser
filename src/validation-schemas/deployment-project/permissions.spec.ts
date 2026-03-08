import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import {
  DeploymentProjectPermissionsPermissionsValidationSchema,
  EnvironmentPermissionsValidationSchema,
} from './permissions.ts';

describe('Deployment Project Permissions Validation', () => {
  describe('Deployment Project Permissions', () => {
    const testCases: unknown[] = parseDocument(`
      # users only with view permission
      - users:
          - admin
        permissions:
          - view

      # groups only with edit permission
      - groups:
          - bamboo-admins
        permissions:
          - edit

      # roles with clone permission
      - roles:
          - logged-in
        permissions:
          - clone

      # users with multiple permissions
      - users:
          - admin
          - manager
        permissions:
          - view
          - edit

      # users and groups combined
      - users:
          - admin
        groups:
          - bamboo-admins
        permissions:
          - view
          - edit

      # users, groups, and roles combined
      - users:
          - admin
        groups:
          - bamboo-admins
        roles:
          - logged-in
        permissions:
          - view
          - edit
          - admin

      # approve-release permission
      - users:
          - release-manager
        permissions:
          - approve-release

      # create-release permission
      - groups:
          - release-team
        permissions:
          - create-release

      # view-configuration permission
      - roles:
          - logged-in
        permissions:
          - view-configuration

      # all deployment permissions
      - users:
          - superadmin
        permissions:
          - view
          - view-configuration
          - edit
          - clone
          - approve-release
          - create-release
          - admin
      `).toJS();

    it.each(testCases)('%s', (testCase) => {
      const result =
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(testCase);
      expect(result).toStrictEqual(testCase);
    });
  });

  describe('Environment Permissions', () => {
    const testCases: unknown[] = parseDocument(`
      # users only with view permission
      - users:
          - admin
        permissions:
          - view

      # groups only with edit permission
      - groups:
          - bamboo-admins
        permissions:
          - edit

      # roles with deploy permission
      - roles:
          - logged-in
        permissions:
          - deploy

      # users with multiple environment permissions
      - users:
          - admin
          - deployer
        permissions:
          - view
          - deploy

      # users and groups combined
      - users:
          - admin
        groups:
          - deployment-team
        permissions:
          - view
          - deploy

      # users, groups, and roles combined
      - users:
          - admin
        groups:
          - deployment-team
        roles:
          - logged-in
        permissions:
          - view
          - edit
          - deploy

      # view-configuration permission
      - roles:
          - logged-in
        permissions:
          - view-configuration

      # all environment permissions
      - users:
          - superadmin
        permissions:
          - view
          - view-configuration
          - edit
          - deploy
      `).toJS();

    it.each(testCases)('%s', (testCase) => {
      const result = EnvironmentPermissionsValidationSchema.parse(testCase);
      expect(result).toStrictEqual(testCase);
    });
  });

  describe('Negative Tests - Deployment Project Permissions', () => {
    it('fails when permissions is missing', () => {
      const invalidCase = {
        users: ['admin'],
      };
      expect(() => {
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(
          invalidCase,
        );
      }).toThrow();
    });

    it('fails with invalid deployment permission', () => {
      const invalidCase = {
        users: ['admin'],
        permissions: ['invalid-permission'],
      };
      expect(() => {
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(
          invalidCase,
        );
      }).toThrow();
    });

    it('fails when users is not array', () => {
      const invalidCase = {
        users: 'admin',
        permissions: ['view'],
      };
      expect(() => {
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(
          invalidCase,
        );
      }).toThrow();
    });

    it('fails when groups is not array', () => {
      const invalidCase = {
        groups: 'bamboo-admins',
        permissions: ['edit'],
      };
      expect(() => {
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(
          invalidCase,
        );
      }).toThrow();
    });

    it('fails when roles is not array', () => {
      const invalidCase = {
        roles: 'logged-in',
        permissions: ['view'],
      };
      expect(() => {
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(
          invalidCase,
        );
      }).toThrow();
    });

    it('fails when permissions is not array', () => {
      const invalidCase = {
        users: ['admin'],
        permissions: 'view',
      };
      expect(() => {
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(
          invalidCase,
        );
      }).toThrow();
    });

    it('fails when users array contains non-string', () => {
      const invalidCase = {
        users: ['admin', 123],
        permissions: ['view'],
      };
      expect(() => {
        DeploymentProjectPermissionsPermissionsValidationSchema.parse(
          invalidCase,
        );
      }).toThrow();
    });
  });

  describe('Negative Tests - Environment Permissions', () => {
    it('fails when permissions is missing', () => {
      const invalidCase = {
        users: ['admin'],
      };
      expect(() => {
        EnvironmentPermissionsValidationSchema.parse(invalidCase);
      }).toThrow();
    });

    it('fails with invalid environment permission', () => {
      const invalidCase = {
        users: ['admin'],
        permissions: ['invalid-env-permission'],
      };
      expect(() => {
        EnvironmentPermissionsValidationSchema.parse(invalidCase);
      }).toThrow();
    });

    it('fails with deployment-only permission (approve-release)', () => {
      const invalidCase = {
        users: ['admin'],
        permissions: ['approve-release'],
      };
      expect(() => {
        EnvironmentPermissionsValidationSchema.parse(invalidCase);
      }).toThrow();
    });

    it('fails with deployment-only permission (create-release)', () => {
      const invalidCase = {
        users: ['admin'],
        permissions: ['create-release'],
      };
      expect(() => {
        EnvironmentPermissionsValidationSchema.parse(invalidCase);
      }).toThrow();
    });

    it('fails with deployment-only permission (clone)', () => {
      const invalidCase = {
        users: ['admin'],
        permissions: ['clone'],
      };
      expect(() => {
        EnvironmentPermissionsValidationSchema.parse(invalidCase);
      }).toThrow();
    });

    it('fails when groups array contains non-string', () => {
      const invalidCase = {
        groups: ['admins', true],
        permissions: ['view'],
      };
      expect(() => {
        EnvironmentPermissionsValidationSchema.parse(invalidCase);
      }).toThrow();
    });

    it('fails when roles array contains non-string', () => {
      const invalidCase = {
        roles: ['logged-in', 42],
        permissions: ['deploy'],
      };
      expect(() => {
        EnvironmentPermissionsValidationSchema.parse(invalidCase);
      }).toThrow();
    });
  });
});
