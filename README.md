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
import { parseAndValidateBambooSpecContent } from 'bamboo-spec-parser';

const yamlString = fs.readFileSync('bamboo-spec.yaml', 'utf-8');
const spec = parseAndValidateBambooSpecContent(yamlString);
```

## API

This library provides two four functions:

- Parse And Validate: Parses the given YAML string and validates it against the Bamboo Specs schema.
  It throws an error if the validation fails.
  - `parseAndValidateBambooSpecContent(yamlString: string): BambooSpec[]`: for browser and Node.js environments.
  - `parseAndValidateBambooSpecFile(filePath: string): BambooSpec[]`: for Node.js environment only.
- ParseNormalized (⚠ IN PROGRESS): Parses the given YAML string and normalizes it into a more user-friendly format.
  - `parseNormalizedBambooSpecContent(yamlString: string): NormalizedBambooSpec[]`: for browser and Node.js environments.
  - `parseNormalizedBambooSpecFile(filePath: string): NormalizedBambooSpec[]`: for Node.js environment only.

Also, the library exports TypeScript types and Zod schemas for the original and normalized specs.
They can be used for type checking and validation in other parts of your application, as well as for building
your own custom parsers and normalizers, or JsonSchemas.

## Parsing Rules

Validation is implemented with [Zod](https://zod.dev/) schemas defined under `src/validation-schemas/`.

1. **Required fields** - fields that must be present in the YAML are modeled without `.optional()` in their Zod schema.
2. **Selectable fields** - fields with a fixed set of allowed values (e.g. `type`, `commandOption`) are modeled
   as `z.enum` / `z.literal` / discriminated unions and are required where applicable.
3. **Mutually exclusive required sets** - when an object has multiple valid shapes (each with its own required fields),
   each shape gets its own Zod schema and the parent schema uses `z.union` or `z.discriminatedUnion` over them.
4. **Defaulted fields** - a field is considered *defaulted* when it is optional in the Bamboo UI but always exported
   in the YAML even if the user never set it (i.e. it carries a UI default). Defaulted fields are modeled as optional
   in the schema because they are not required from the user.
5. **Optional fields** - all remaining fields that are optional in the Bamboo UI and not defaulted are modeled
   as `.optional()`.

## Normalization Rules

⚠ IN PROGRESS

The normalized spec is a more user-friendly format that is easier to work with in JavaScript. It is designed to be as
close to the original YAML file as possible while eliminating some of unnecessary complexity of the original schema.

Base rules for the normalized spec:

1. Jobs are moved from the root level to a `jobs` array under the `stage` array.
2. Stringified environment variables are converted to string-string records (like a root-level env list).
3. If an object or a list can contain only one item, unnecessary nesting is removed.
4. If there are multiple versions of the same fields (e.g. different tasks), and they do not have a deterministic field,
   a synthetic deterministic field with `$bs_` prefix is added to the object to determine the type of the object.
   It is specially useful for tasks, where the `key` field is omitted by the previous rule.
5. If a field contains data that is represented in a more user-friendly way in other place of the spec, it is converted
   to the more user-friendly format. For example, environment variables are converted to a string-string record.

## Supported Tasks

All tasks are supported at least as generic `any-task` type. The following built-in task types are also supported with
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
