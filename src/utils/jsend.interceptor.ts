import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JSONResponse } from './json-response';

@Injectable()
export class JSendInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = Date.now();
    const endpoint = request.originalUrl;
    (request as any).startTime = startTime; // Store to be used by exception filter if needed

    return next.handle().pipe(
      map(data => {
        const responseTime = Date.now() - startTime;
        const time = new Date().toISOString();

        // Create meta object with required information
        const meta: any = {
          endpoint,
          time,
          response_time: `${responseTime}ms`,
        };

        // Check if data is using PaginationResponseDto structure (from pagination utility)
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'total' in data &&
          'page' in data &&
          'limit' in data
        ) {
          const { data: items, ...paginationInfo } = data;

          const paginationMeta = {
            page: paginationInfo.page,
            limit: paginationInfo.limit,
            total_items: paginationInfo.total,
            total_pages: paginationInfo.totalPages,
            has_next_page: paginationInfo.hasNextPage || false,
          };

          return JSONResponse.success(items, {
            ...meta,
            pagination: paginationMeta,
          });
        }

        // Logic for cases where meta/pagination is already provided
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data &&
          data.meta &&
          typeof data.meta === 'object' &&
          'pagination' in data.meta
        ) {
          return JSONResponse.success(data.data, {
            ...meta,
            pagination: data.meta.pagination,
          });
        }

        return JSONResponse.success(data, meta);
      }),
    );
  }
}
