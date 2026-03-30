import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom base exception for the API that follows JSend principles.
 * This can be used for any error that isn't a simple built-in NestJS exception.
 */
export class ApiException extends HttpException {
  public readonly errors?: Record<string, any>;

  constructor(
    message: string,
    status: number = HttpStatus.BAD_REQUEST,
    errors?: Record<string, any>,
  ) {
    // Construct the response object that'll be picked up by the Exception Filter
    super(
      {
        message,
        errors,
        statusCode: status,
      },
      status,
    );

    this.errors = errors;
  }

  /**
   * Helper to throw a 'fail' status exception with a message and errors.
   */
  static fail(
    message: string,
    errors?: Record<string, any>,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    return new ApiException(message, status, errors);
  }

  /**
   * Helper to throw a validation exception (422) with a map of errors.
   */
  static validation(
    errors: Record<string, any>,
    message: string = 'validation',
  ) {
    return new ApiException(message, HttpStatus.UNPROCESSABLE_ENTITY, errors);
  }

  /**
   * Helper to throw an unauthorized exception (401).
   */
  static unauthorized(
    message: string = 'unauthorized',
    errors?: Record<string, any>,
  ) {
    return new ApiException(message, HttpStatus.UNAUTHORIZED, errors);
  }

  /**
   * Helper to throw a not found exception (404).
   */
  static notFound(message: string = 'notFound', errors?: Record<string, any>) {
    return new ApiException(message, HttpStatus.NOT_FOUND, errors);
  }

  /**
   * Helper to throw a forbidden exception (403).
   */
  static forbidden(
    message: string = 'forbidden',
    errors?: Record<string, any>,
  ) {
    return new ApiException(message, HttpStatus.FORBIDDEN, errors);
  }

  /**
   * Helper to throw an internal server error exception (500).
   */
  static server(message: string = 'server', errors?: Record<string, any>) {
    return new ApiException(message, HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}
