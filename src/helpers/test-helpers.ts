import { expect } from 'vitest';
import { parseDocument } from 'yaml';
import type { z } from 'zod';

export const assertYamlParsingFail = <T>(
  schema: z.Schema<T>,
  yamlString: string,
): void => {
  const parsedYaml = parseDocument(yamlString).toJSON();

  const result = schema.safeParse(parsedYaml);

  expect(result.success).toBe(false);
};

export const assertYamlParsingFullyParsed = <T>(
  schema: z.Schema<T>,
  yamlString: string,
): void => {
  const parsedYaml = parseDocument(yamlString).toJSON();

  const result = schema.safeParse(parsedYaml);

  expect(result.error).toBeUndefined();
  expect(result.data).toEqual(parsedYaml);
  expect(result.success).toBe(true);
};

export const assertObjectParsing = (
  schema: z.Schema,
  object: unknown,
): void => {
  const parsed = schema.parse(object);
  expect(parsed).toStrictEqual(object);
};

export const parseAndExtendTaskTestCases = (yamlString: string): object[] => {
  const rawCases: unknown[] = parseDocument(yamlString).toJS();

  const fullCase = Object.values(rawCases).find(
    (value) =>
      typeof value === 'object' &&
      value !== null &&
      typeof Object.values(value)[0] === 'object',
  ) as Record<string, unknown>;

  const key = Object.keys(fullCase)[0];
  const fullValue = fullCase[key] as object;

  const extraCases = [
    {
      [key]: {
        description: 'test description',
        ...fullValue,
      },
    },
    {
      [key]: {
        conditions: [
          {
            variable: {
              exists: 'some-variable',
            },
          },
        ],
        ...fullValue,
      },
    },
  ];

  return [...rawCases, ...extraCases] as [];
};

export const createSchemaAsserter = (schema: z.Schema) => {
  return (obj: unknown) => assertObjectParsing(schema, obj);
};

export const createFailSchemaAsserter = (schema: z.Schema) => {
  return (obj: unknown) => {
    const result = schema.safeParse(obj);
    expect(result.success).toBe(false);
  };
};
