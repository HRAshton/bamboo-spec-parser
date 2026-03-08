import { describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';
import { OtherValidationSchema } from './other.ts';

describe('Build Plan Others validation schema', () => {
  const testCases: unknown[] = parseDocument(`
    - 
      concurrent-build-plugin:
        number-of-concurrent-builds: 3
        execution-strategy: stop-oldest-builds
      all-other-apps:
        custom:
          artifactHandlers:
            useCustomArtifactHandlers: true
            'comAtlassianBambooPluginArtifactHandlerRemote:S3ArtifactHandler:enabledForShared': true
            'comAtlassianBambooPluginArtifactHandlerRemote:S3ArtifactHandler:enabledForNonShared': true
          buildExpiryConfig:
            duration: 5
            enabled: true
            expiryTypeResult: true
            maximumBuildsToKeep: 1
            period: days
    - 
      concurrent-build-plugin: 5
    `).toJS();

  it.each(testCases)('%s', (testCase) => {
    const result = OtherValidationSchema.parse(testCase);
    expect(result).toStrictEqual(testCase);
  });
});
