# bamboo-spec-parser

[CI](https://github.com/HRAshton/bamboo-spec-parser/actions) · [Releases](https://github.com/HRAshton/bamboo-spec-parser/releases) · [Issues](https://github.com/HRAshton/bamboo-spec-parser/issues)

[![npm](https://img.shields.io/npm/v/bamboo-spec-parser?logo=npm&label=npm)](https://www.npmjs.com/package/bamboo-spec-parser)
[![CI](https://github.com/HRAshton/bamboo-spec-parser/actions/workflows/ci.yml/badge.svg)](https://github.com/HRAshton/bamboo-spec-parser/actions)
[![codecov](https://codecov.io/github/HRAshton/bamboo-spec-parser/graph/badge.svg?token=J4TBODQMFV)](https://codecov.io/github/HRAshton/bamboo-spec-parser)

A TypeScript library for parsing Bamboo Specs YAML files into structured JavaScript objects.

## Usage

```shell
npm install bamboo-spec-parser
```

```typescript
import fs from 'fs';
import { parseSpec } from 'bamboo-spec-parser';

const yamlString = fs.readFileSync('bamboo-spec.yaml', 'utf-8');
const spec = parseSpec(yamlString);
```

## Parsing Rules

1. Required fields must be present in the YAML file.
2. Fields that are set up as selectable options (e.g. `type` fields) are required.
3. If one object has multiple sets of required fields, a separate schema is created for each set of required fields and
   the main schema uses a union of these schemas.
4. A field is considered defaulted if the following conditions are met:

   - The field is optional in the UI.
   - In the exported YAML file, the field is present even though it was not explicitly set by the user
     (i.e. it is set to its default value).

5. A field is considered optional if it is optional in the UI, and it is not defaulted.

## Normalization Rules

The normalized spec is a more user-friendly format that is easier to work with in JavaScript. It is designed to be as
close to the original YAML file as possible while elliminating some of unnecessary complexity of the original schema.

Base rules for the normalized spec:

1. Jobs are moved from the root level to a `jobs` array under the `stage` array.
2. Stringified environment variables are converted to string-string records (like a root-level env list).
3. If an object or a list can contain only one item, unnecessary nesting is removed.
4. If there are multiple versions of the same fields (e.g. different tasks), and they do not have a deterministic field,
   a synthetic deterministic field with `$bs_` prefix is added to the object to determine the type of the object.
   It is specially useful for tasks, where the `key` field is omitted by the previous rule.

## Supported Tasks

All tasks are supported at least as generic `any-task` type. The following build-in task types are also supported with
their own specific types:

Supported task types:

- Artifact download
- Clean working directory
- Script
- Inject Bamboo variables
- Test Results Parser
- Repository Branch
- Repository Commit
- Repository Push
- Repository Tag
- Maven
- Docker

Unsupported task types:

- Ant
- Bower
- Build warnings parser
- Command
- Copy variable
- Deploy Tomcat Application
- Dump variables to log
- Fastlane
- Grails
- Grunt
- Gulp
- Maven 1.x
- Maven 2.x
- Maven 3.x
- Maven Dependencies Processor
- Maven Version Variable Extractor
- MBUnit Parser
- Mocha Test Runner
- MSBuild
- MSTest Runner
- NAnt
- Node.js
- Nodeunit
- npm
- NUnit Runner
- OCUnit Test Parser
- PHPUnit
- PHPUnit 3.3.X
- Reload Tomcat Application
- SCP Task
- Source Code Checkout
- SSH Task
- Start Tomcat Application
- Stop job execution
- Stop Tomcat Application
- Undeploy Tomcat Application
- Unlock Keychain
- Upload iOS application to HockeyApp
- Upload iOS application to TestFlightApp.com
- Variable File reader
- Version Variable Incrementer
- Visual Studio
- VSTest Runner
- Xcode

## License

MIT © [HRAshton](https://github.com/HRAshton)
