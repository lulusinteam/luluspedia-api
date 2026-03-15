import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class JSendExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const startTime = Date.now();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Create meta object with required information
    const endpoint = request.originalUrl;
    const time = new Date().toISOString();
    const responseTime = Date.now() - startTime;
    const meta: any = {
      endpoint,
      time,
      response_time: `${responseTime}ms`,
    };

    let responseBody: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse: any = exception.getResponse();

      // For standard NestJS 400 Bad Request (Validation errors)
      if (status === HttpStatus.BAD_REQUEST) {
        responseBody = {
          status: 'fail',
          data: {
            message:
              typeof errorResponse === 'string'
                ? errorResponse
                : errorResponse.message || 'Validation failed',
            errors: errorResponse.errors || undefined,
            error: errorResponse.error || 'Bad Request',
            statusCode: status,
          },
          meta,
        };
      } else if (status >= 400 && status < 500) {
        // Client errors (4xx) are mapped to "fail" status
        responseBody = {
          status: 'fail',
          data: {
            message:
              typeof errorResponse === 'string'
                ? errorResponse
                : errorResponse.message || 'Client error',
            error: errorResponse.error || 'Fail',
            statusCode: status,
          },
          meta,
        };
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
    } else {
      // For any other unexpected errors
      responseBody = {
        status: 'error',
        message: (exception as any)?.message || 'Internal server error',
        code: status,
        meta,
      };
    }

    response.status(status).json(responseBody);
  }
}
