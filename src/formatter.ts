import { format } from "prettier/standalone";
import * as prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import * as E from "fp-ts/Either";

const defaultConfig = {
  parser: "json",
  plugins: [parserBabel],
  printWidth: 120,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  semi: false,
} as prettier.Options;

export const formatJSONWithPrettier = (
  json: string,
  config: prettier.Options = defaultConfig
): E.Either<Error, string> => {
  try {
    return E.right(format(json, config));
  } catch (e) {
    return E.left(e as Error);
  }
};
