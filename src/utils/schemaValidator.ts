import Ajv from 'ajv';
import { logger } from './logger';

const ajv = new Ajv({ allErrors: true });

export function validateSchema(schema: object, data: any): { valid: boolean; errors?: any } {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    logger.error(`Schema validation failed: ${JSON.stringify(validate.errors)}`);
    return { valid: false, errors: validate.errors };
  }
  
  return { valid: true };
}
