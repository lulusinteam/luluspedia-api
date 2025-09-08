import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * JSend Exception Filter
 *
 * Handles exceptions and formats them according to JSend specification:
 * https://github.com/omniti-labs/jsend
 *
 * - Client errors (4xx) are mapped to "fail" status
 * - Server errors (5xx) are mapped to "error" status
 */
@Catch()
export class JSendExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const startTime = Date.now();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Create meta object with required information
    const meta = {
      endpoint: request.originalUrl,
      time: new Date().toISOString(),
      response_time: `${Date.now() - startTime}ms`,
    };

    let responseBody: any = {
      status: 'error',
      message: 'Internal server error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      meta,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as any;

      // Client errors (4xx) are mapped to "fail" status
      if (
        status >= HttpStatus.BAD_REQUEST &&
        status < HttpStatus.INTERNAL_SERVER_ERROR
      ) {
        // For validation errors (typically 422 Unprocessable Entity)
        if (errorResponse.errors) {
          responseBody = {
            status: 'fail',
            data: errorResponse.errors,
            meta,
          };
        } else {
          // For other client errors
          responseBody = {
            status: 'fail',
            data: {
              message:
                typeof errorResponse === 'string'
                  ? errorResponse
                  : errorResponse.message || 'Client error',
            },
            meta,
          };
        }
      } else {
        // Server errors (5xx) are mapped to "error" status
        responseBody = {
          status: 'error',
          message:
            typeof errorResponse === 'string'
              ? errorResponse
              : errorResponse.message || 'Server error',
          code: status,
          meta,
        };
      }
    }

    // Add request path to error responses for easier debugging
    if (responseBody.status === 'error') {
      responseBody.meta.path = request.url;
    }

    response.status(status).json(responseBody);
  }
}
