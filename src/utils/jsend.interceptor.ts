import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

          // Map camelCase to snake_case for hasNextPage if needed by docs,
          // or just keep as is if consensus is camelCase.
          // The docs say "has_next_page".
          const paginationMeta = {
            page: paginationInfo.page,
            limit: paginationInfo.limit,
            total_items: paginationInfo.total,
            total_pages: paginationInfo.totalPages,
            has_next_page: paginationInfo.hasNextPage || false,
          };

          return {
            status: 'success',
            data: items,
            meta: {
              ...meta,
              pagination: paginationMeta,
            },
          };
        }

        // Logic for other paginated structures if any
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data &&
          data.meta &&
          typeof data.meta === 'object' &&
          'pagination' in data.meta
        ) {
          const paginationMeta = data.meta.pagination;

          return {
            status: 'success',
            data: data.data,
            meta: {
              ...meta,
              pagination: paginationMeta,
            },
          };
        }

        return {
          status: 'success',
          data: data || {},
          meta,
        };
      }),
    );
  }
}
