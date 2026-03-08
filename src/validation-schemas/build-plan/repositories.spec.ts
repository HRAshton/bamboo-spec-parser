import { describe, it } from 'vitest';
import {
  assertYamlParsingFail,
  assertYamlParsingFullyParsed,
} from '../../helpers/test-helpers';
import { RepositoryValidationSchema } from './repositories.ts';

describe('Repository Validation Schemas', () => {
  describe('Linked Repository Reference', () => {
    it('should validate a simple string reference', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `my linked repo`,
      );
    });

    it('should validate an object', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my linked repo:
          scope: global
        `,
      );
    });
  });

  describe('Git Repository', () => {
    it('should validate a minimal git repository', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: git
          url: https://github.com/user/repo.git
          branch: main
        `,
      );
    });

    it('should validate a git repository with all properties', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: git
          url: https://github.com/user/repo.git
          branch: main
          shared-credentials: my-credentials
          ssh-key: my-ssh-key
          ssh-key-passphrase: my-passphrase
          command-timeout-minutes: 10
          lfs: true
          verbose-logs: true
          use-shallow-clones: true
          cache-on-agents: true
          submodules: true
          fetch-all: false
          change-detection:
            exclude-changeset-pattern: ".*\\.md"
            file-filter-type: include_only
            file-filter-pattern: "src/**"
        `,
      );
    });

    it('should validate a git repository with shared-credentials object', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: git
          url: https://github.com/user/repo.git
          branch: main
          shared-credentials:
            name: my-credentials
            scope: project
        `,
      );
    });

    it('should fail validation if url is missing', () => {
      assertYamlParsingFail(
        RepositoryValidationSchema,
        `
        my repo:
          type: git
          branch: main
        `,
      );
    });

    it('should fail validation if branch is missing', () => {
      assertYamlParsingFail(
        RepositoryValidationSchema,
        `
        my repo:
          type: git
          url: ssh://git@example.com/user/repo.git
        `,
      );
    });
  });

  describe('Bitbucket Cloud Repository', () => {
    it('should validate a minimal bitbucket cloud repository', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: bitbucket
          slug: my-repo
          branch: main
        `,
      );
    });

    it('should validate a bitbucket cloud repository with all properties', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: bitbucket
          slug: my-repo
          branch: main
          viewer: fisheye-viewer
          command-timeout-minutes: 15
          lfs: true
          verbose-logs: false
          use-shallow-clones: true
          cache-on-agents: false
          submodules: true
          fetch-all: true
        `,
      );
    });

    it('should fail validation if slug is missing', () => {
      assertYamlParsingFail(
        RepositoryValidationSchema,
        `
        my repo:
          type: bitbucket
          branch: main
        `,
      );
    });
  });

  describe('GitHub Repository', () => {
    it('should validate a minimal github repository', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: github
          repository: user/repo
          branch: main
          user: github-user
          password: github-token
          `,
      );
    });

    it('should validate a github repository with all properties', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: github
          repository: user/repo
          branch: main
          user: github-user
          password: github-token
          viewer: fisheye-viewer
          command-timeout-minutes: 20
          lfs: false
          verbose-logs: true
          use-shallow-clones: false
          cache-on-agents: true
          submodules: false
          fetch-all: true
          `,
      );
    });

    it('should fail validation if user is missing', () => {
      assertYamlParsingFail(
        RepositoryValidationSchema,
        `
        my repo:
          type: github
          repository: user/repo
          branch: main
          password: github-token
          `,
      );
    });

    it('should fail validation if password is missing', () => {
      assertYamlParsingFail(
        RepositoryValidationSchema,
        `
        my repo:
          type: github
          repository: user/repo
          branch: main
          user: github-user
          `,
      );
    });
  });

  describe('Bitbucket Server Repository', () => {
    it('should validate a minimal bitbucket server repository', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: bitbucket-server
          server: https://bitbucket.company.com
          project: PROJ
          slug: my-repo
          clone-url: https://bitbucket.company.com/scm/proj/my-repo.git
          branch: main
          `,
      );
    });

    it('should validate a bitbucket server repository with all properties', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          type: bitbucket-server
          server: https://bitbucket.company.com
          project: PROJ
          slug: my-repo
          clone-url: https://bitbucket.company.com/scm/proj/my-repo.git
          public-key: public-key-id
          private-key: private-key-id
          branch: main
          viewer: fisheye-viewer
          command-timeout-minutes: 25
          lfs: true
          verbose-logs: true
          use-shallow-clones: true
          cache-on-agents: true
          submodules: true
          fetch-all: false
          `,
      );
    });

    it('should fail validation if server is missing', () => {
      assertYamlParsingFail(
        RepositoryValidationSchema,
        `
        my repo:
          type: bitbucket-server
          project: PROJ
          slug: my-repo
          clone-url: https://bitbucket.company.com/scm/proj/my-repo.git
          branch: main
          `,
      );
    });
  });

  describe('Subversion Repository', () => {
    it('should validate a subversion repository with config', () => {
      assertYamlParsingFullyParsed(
        RepositoryValidationSchema,
        `
        my repo:
          plugin-key: com.atlassian.bamboo.plugin.system.repository:svnv2
          server-config:
            repository.svn.authType: ssl-client-certificate
            repository.svn.branch.create.autodetectPath: 'true'
            repository.svn.repositoryRoot: dfg
            repository.svn.sslKeyFile: asd
            repository.svn.sslPassphrase: BAMSCRT@0@0@D5x8iI/AJ8wyyUYUfIUsTg==
            repository.svn.tag.create.autodetectPath: 'true'
            repository.svn.useExport: 'true'
            repository.svn.useExternals: 'true'
            repository.svn.username: asd
            repository.svn.userPassword: BAMSCRT@0@0@GwDhPyvRqKtaaYAVeUyqSg==
          branch-config:
            repository.svn.branch.displayName: dfgasd
            repository.svn.branch.path: asd
          branch-detection-config:
            repository.svn.branch.detection.path: '{overridden=true}'
          change-detection:
            commit-isolation: true
            exclude-changeset-pattern: asd
            file-filter-type: exclude_all
            file-filter-pattern: asd
          viewer:
            generic:
              url: http://localhost:8085/chain/admin/config/editChainRepository.action?buildKey=AA-AA
              repository-path: http://localhost:8085/chain/admin/config/editChainRepository.action?buildKey=AA-AA
        `,
      );
    });
  });
});
