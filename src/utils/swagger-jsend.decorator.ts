import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

/**
 * Meta information for JSend responses
 */
export class JSendMetaResponse {
  @ApiProperty({ example: '/api/users' })
  endpoint: string;

  @ApiProperty({ example: '2023-10-15T12:34:56.789Z' })
  time: string;

  @ApiProperty({ example: '123ms' })
  response_time: string;

  @ApiProperty({
    required: false,
    type: Object,
    example: { page: 1, limit: 10, has_next_page: true },
  })
  pagination?: Record<string, any>;
}

/**
 * JSend Success Response wrapper for Swagger documentation
 */
export class JSendSuccessResponse<T> {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ type: JSendMetaResponse })
  meta: JSendMetaResponse;
}

/**
 * JSend Fail Response wrapper for Swagger documentation
 */
export class JSendFailResponse {
  @ApiProperty({ example: 'fail' })
  status: string;

  @ApiProperty()
  data: Record<string, any>;

  @ApiProperty({ type: JSendMetaResponse })
  meta: JSendMetaResponse;
}

/**
 * JSend Error Response wrapper for Swagger documentation
 */
export class JSendErrorResponse {
  @ApiProperty({ example: 'error' })
  status: string;

  @ApiProperty({ example: 'An error occurred' })
  message: string;

  @ApiProperty({ example: 500 })
  code: number;

  @ApiProperty({ type: JSendMetaResponse })
  meta: JSendMetaResponse;
}

/**
 * Decorator for documenting JSend formatted API responses in Swagger
 *
 * @param dataDto The DTO class that describes the data property in a success response
 * @returns Decorator
 */
export const ApiJSendResponse = <TModel extends Type<any>>(dataDto: TModel) => {
  return applyDecorators(
    ApiExtraModels(
      JSendSuccessResponse,
      JSendFailResponse,
      JSendErrorResponse,
      dataDto,
    ),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(JSendSuccessResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );
};
