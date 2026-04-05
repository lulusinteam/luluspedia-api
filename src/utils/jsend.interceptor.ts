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

        // If data is already a JSendResponse, just return it as is but update response time
        if (
          data &&
          typeof data === 'object' &&
          'status' in data &&
          'data' in data &&
          'meta' in data
        ) {
          // If it's a JSendResponse, we don't want to double wrap it
          // But we can update the response time in meta
          const jsendData = data as any;
          jsendData.meta = {
            ...jsendData.meta,
            endpoint: endpoint,
            time: time,
            response_time: `${responseTime}ms`,
          };
          return jsendData;
        }

        const meta: any = {
          endpoint,
          time,
          response_time: `${responseTime}ms`,
        };

        // Check if data is using PaginationResponseDto structure (either infinity or full)
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'hasNextPage' in data &&
          'page' in data &&
          'limit' in data
        ) {
          const { data: items, ...paginationInfo } = data as any;

          const paginationMeta: any = {
            page: paginationInfo.page,
            limit: paginationInfo.limit,
            has_next_page: paginationInfo.hasNextPage,
          };

          // If full pagination (has total), add those fields
          if ('total' in paginationInfo) {
            paginationMeta.total_items = paginationInfo.total;
            paginationMeta.total_pages = paginationInfo.totalPages;
          }

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
