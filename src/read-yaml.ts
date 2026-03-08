import { type Document, parseAllDocuments, type ScalarTag } from 'yaml';
import type { ParsingError } from './parsing-result-models.ts';

function createIncludeTag(
  includeTagYamlProvider?: (requiredPath: string) => string,
): ScalarTag {
  return {
    tag: '!include',
    resolve(value: string) {
      if (!includeTagYamlProvider) {
        throw new Error('!include tag used but no provider function was given');
      }

      const content = includeTagYamlProvider(value);

      const includedDocs = parseAllDocuments(content);
      if (includedDocs.length !== 1) {
        throw new Error('!include supports single-document YAML only');
      }

      return includedDocs[0].toJS();
    },
  };
}

const convertErrors = (docs: Document.Parsed[]): ParsingError[] => {
  return docs.flatMap((doc, index) =>
    doc.errors.map((err) => ({
      stage: 'reading',
      message: `Document #${index} failed to parse: ${err.message}`,
      details: {
        documentIndex: index,
        yamlError: err,
      },
    })),
  );
};

export const readYaml = (
  yamlContent: string,
  includeTagYamlProvider?: (requiredPath: string) => string,
): Document.Parsed[] => {
  const includeTag = createIncludeTag(includeTagYamlProvider);
  const docs = parseAllDocuments(yamlContent, { customTags: [includeTag] });

  if ('empty' in docs) {
    throw new Error('Unexpected empty document result from YAML parsing');
  }

  const errors = convertErrors(docs);
  if (errors.length === 0) {
    return docs;
  }

  const errorsStr = errors
    .map((e) => `- ${e.message} (${JSON.stringify(e.details)})`)
    .join('\n');

  throw new Error(
    `YAML parsing failed with ${errors.length} error(s):\n${errorsStr}`,
  );
};
