import { z } from 'zod';

// Common regex pattern for environment variable format validation
const ENV_VAR_FORMAT_REGEX = /^(\s*(?:"[^"]+"|[^\s=]+)=(?:"[^"]*"|\S*)\s*)*$/;

// Validation schema: only validates that string matches correct format
export const EnvironmentVariablesValidationSchema = z
  .string()
  .regex(ENV_VAR_FORMAT_REGEX);
