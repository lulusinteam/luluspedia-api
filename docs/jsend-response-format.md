# JSend Response Format

## Overview

This project implements the JSend specification for consistent API responses. JSend is a simple specification that defines a format for API responses that is both easy to read and easy to generate.

## Response Format

All API responses follow the JSend format with the following structure:

### Success Response

When an API call is successful, the response will have this format:

```json
{
  "status": "success",
  "data": {
    // Response data goes here
  }
}
```

### Fail Response

When an API call fails due to invalid data or other client-side issues (4xx errors), the response will have this format:

```json
{
  "status": "fail",
  "data": {
    // Validation errors or other client-side error details
    "field1": "Error message for field1",
    "field2": "Error message for field2"
  }
}
```

### Error Response

When an API call fails due to a server error or other unexpected issue (5xx errors), the response will have this format:

```json
{
  "status": "error",
  "message": "Error message describing what went wrong",
  "code": 500, // HTTP status code
  "path": "/api/resource" // Request path (included for debugging)
}
```

## Implementation

The JSend format is implemented using the following components:

1. **JSendInterceptor**: A global interceptor that transforms all successful responses to the JSend format.
2. **JSendExceptionFilter**: A global exception filter that transforms all exceptions to the JSend format.
3. **ApiJSendResponse**: A Swagger decorator for documenting JSend-formatted API responses.

## Usage in Controllers

### Documenting JSend Responses with Swagger

To document JSend responses in Swagger, use the `ApiJSendResponse` decorator instead of `ApiOkResponse`:

```typescript
import { ApiJSendResponse } from '../utils/swagger-jsend.decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  @Get()
  @ApiJSendResponse(UserDto)
  findAll() {
    // Your controller method
  }
}
```

## Benefits

1. **Consistency**: All API responses follow the same format, making it easier for clients to parse and handle responses.
2. **Clear Status Indication**: The `status` field clearly indicates whether the request was successful, failed due to client error, or failed due to server error.
3. **Improved Error Handling**: Client-side errors (validation errors, etc.) are clearly distinguished from server-side errors.
4. **Better Documentation**: The Swagger documentation accurately reflects the actual response format.

## References

- [JSend Specification](https://github.com/omniti-labs/jsend)