import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Request } from 'express';

/**
 * JSend Response Format Interceptor
 *
 * Implements the JSend specification for consistent API responses:
 * https://github.com/omniti-labs/jsend
 *
 * Response formats:
 * - Success: { status: "success", data: {...} }
 * - Fail: { status: "fail", data: {...} } (for 4xx errors with validation issues)
 * - Error: { status: "error", message: "...", code: xxx } (for 5xx and other errors)
 */
@Injectable()
export class JSendInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = Date.now();
    const endpoint = request.originalUrl;

    return next.handle().pipe(
      map((data) => {
        const responseTime = Date.now() - startTime;
        const time = new Date().toISOString();

        // Create meta object with required information
        const meta = {
          endpoint,
          time,
          response_time: `${responseTime}ms`,
        };

        // Check if data contains pagination information
        if (
          data &&
          data.hasNextPage !== undefined &&
          Array.isArray(data.data)
        ) {
          // Move pagination info to meta
          const paginationMeta = {
            has_next_page: data.hasNextPage,
          };

          // Add page and limit if available
          if (data.page !== undefined) {
            paginationMeta['page'] = data.page;
          }

          if (data.limit !== undefined) {
            paginationMeta['limit'] = data.limit;
          }

          return {
            status: 'success',
            data: data.data,
            meta: {
              ...meta,
              pagination: paginationMeta,
            },
          };
        }

        // Handle regular successful responses
        return {
          status: 'success',
          data: data || {},
          meta,
        };
      }),
      catchError((error) => {
        // Handle HttpExceptions (4xx, 5xx)
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const errorResponse = error.getResponse() as any;

          // Client errors (4xx) are mapped to "fail" status
          if (
            status >= HttpStatus.BAD_REQUEST &&
            status < HttpStatus.INTERNAL_SERVER_ERROR
          ) {
            // For validation errors (typically 422 Unprocessable Entity)
            if (errorResponse.errors) {
              return throwError(
                () =>
                  new HttpException(
                    {
                      status: 'fail',
                      data: errorResponse.errors,
                    },
                    status,
                  ),
              );
            }

            // For other client errors
            return throwError(
              () =>
                new HttpException(
                  {
                    status: 'fail',
                    data: {
                      message:
                        typeof errorResponse === 'string'
                          ? errorResponse
                          : errorResponse.message || 'Client error',
                    },
                  },
                  status,
                ),
            );
          }

          // Server errors (5xx) are mapped to "error" status
          return throwError(
            () =>
              new HttpException(
                {
                  status: 'error',
                  message:
                    typeof errorResponse === 'string'
                      ? errorResponse
                      : errorResponse.message || 'Server error',
                  code: status,
                },
                status,
              ),
          );
        }

        // Unexpected errors
        return throwError(
          () =>
            new HttpException(
              {
                status: 'error',
                message: 'Internal server error',
                code: HttpStatus.INTERNAL_SERVER_ERROR,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
