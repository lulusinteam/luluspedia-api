import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
      map(data => {
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
    );
  }
}
