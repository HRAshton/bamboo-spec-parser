export type ParsingError = {
  stage: 'reading' | 'validation';
  message: string;
  details?: unknown;
};

export type ParsingResult<T> =
  | {
      success: false;
      errors: ParsingError[];
    }
  | {
      success: true;
      result: T;
    };
