import {
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ApiException } from './exceptions/api.exception';

function generateErrors(errors: ValidationError[]) {
  return errors.reduce((accumulator, currentValue) => {
    let error: string | object = '';

    if (currentValue.children && currentValue.children.length > 0) {
      error = generateErrors(currentValue.children);
    } else if (currentValue.constraints) {
      // Get the first constraint key (e.g., 'isNotEmpty', 'isString')
      const constraintKeys = Object.keys(currentValue.constraints);
      const firstKey = constraintKeys[0];
      const message = currentValue.constraints[firstKey];

      // Try to extract params for min/max if they exist in the message
      if (
        firstKey === 'min' ||
        firstKey === 'max' ||
        firstKey === 'arrayMinSize'
      ) {
        const match = message.match(/\d+/);
        if (match) {
          error = `${firstKey}:${match[0]}`;
        } else {
          error = firstKey;
        }
      } else {
        error = firstKey;
      }
    }

    return {
      ...accumulator,
      [currentValue.property]: error,
    };
  }, {});
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return ApiException.validation(generateErrors(errors));
  },
};

export default validationOptions;
