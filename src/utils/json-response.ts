import { HttpStatus } from '@nestjs/common';

export type JSendStatus = 'success' | 'fail' | 'error';

export interface JSendResponse<T = any> {
  status: JSendStatus;
  data: T | null;
  message?: string;
  code?: number;
  meta: {
    endpoint: string;
    time: string;
    response_time: string;
    pagination?: any;
    [key: string]: any;
  };
}

export class JSONResponse {
  static success<T>(data: T, meta: any = {}): JSendResponse<T> {
    return {
      status: 'success',
      data: data ?? null,
      meta: {
        endpoint: '',
        time: new Date().toISOString(),
        response_time: '0ms',
        ...meta,
      },
    };
  }

  static fail<T>(
    messageOrErrors: string | Record<string, any>,
    statusCode: number = HttpStatus.BAD_REQUEST,
    meta: any = {},
  ): JSendResponse<T> {
    const data: any = {};

    if (typeof messageOrErrors === 'string') {
      data.message = messageOrErrors;
    } else {
      data.message = 'validation'; // Key for localized validation message
      data.errors = messageOrErrors;
    }

    data.statusCode = statusCode;

    return {
      status: 'fail',
      data: data as T,
      meta: {
        endpoint: '',
        time: new Date().toISOString(),
        response_time: '0ms',
        ...meta,
      },
    };
  }

  static error(
    message: string,
    code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    meta: any = {},
  ): JSendResponse {
    return {
      status: 'error',
      data: null,
      message: message || 'Internal server error',
      code,
      meta: {
        endpoint: '',
        time: new Date().toISOString(),
        response_time: '0ms',
        ...meta,
      },
    };
  }
}
