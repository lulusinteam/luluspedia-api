import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Request, Response } from 'express';
import { JSONResponse } from './json-response';

@Catch()
export class JSendExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(JSendExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const startTime = (request as any).startTime || Date.now();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseTime = Date.now() - startTime;
    const i18n = I18nContext.current(host);
    const meta: any = {
      endpoint: request.originalUrl,
      time: new Date().toISOString(),
      response_time: `${responseTime}ms`,
      lang: i18n?.lang || 'none',
    };

    let responseBody: any;

    if (exception instanceof HttpException) {
      const errorResponse: any = exception.getResponse();
      const i18n = I18nContext.current(host);

      let message =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse.message || exception.message || 'errors.server';

      // Attempt to translate the main message if it looks like a key
      if (i18n && typeof message === 'string') {
        const translated = i18n.t(
          message.includes('.') ? message : `errors.${message}`,
        );
        // If translation is the same as key, it might not be a key, but for our error keys it usually works
        if (
          typeof translated === 'string' &&
          translated !== message &&
          !translated.startsWith('errors.')
        ) {
          message = translated;
        }
      }

      // For client errors (4xx), use the fail status
      if (status >= 400 && status < 500) {
        // Extract errors object if it exists (for validation errors)
        const errors =
          typeof errorResponse === 'object' ? errorResponse.errors : undefined;

        // Translate validation errors if they exist
        let translatedErrors = errors;
        if (i18n && errors && typeof errors === 'object') {
          // Define recursive translation function for Laravel-style bilingual errors
          const translateValidation = (errs: any, parentKey: string = '') => {
            const result: any = {};

            for (const key in errs) {
              const val = errs[key];
              const currentPath = parentKey ? `${parentKey}.${key}` : key;

              if (typeof val === 'object' && val !== null) {
                result[key] = translateValidation(val, currentPath);
              } else if (typeof val === 'string') {
                // Try to translate the attribute name
                const attrKey = `validation.attributes.${key}`;
                let attrTranslated = i18n.t(attrKey) as string;
                // Fallback: use key and capitalize
                if (
                  !attrTranslated ||
                  typeof attrTranslated !== 'string' ||
                  attrTranslated.startsWith('validation.attributes.')
                ) {
                  attrTranslated = key.charAt(0).toUpperCase() + key.slice(1);
                }

                // Handle parameterized translations (e.g., 'min:1')
                const parts = val.split(':');
                const validatorKey = parts[0];
                const paramValue = parts[1];

                // 1. Try to find a CUSTOM message for this specific path and validator
                // e.g., validation.custom.category.id.isNotEmpty
                const customMsgKey = `validation.custom.${currentPath}.${validatorKey}`;
                let msgTranslated = i18n.t(customMsgKey) as string;

                // 2. If no custom message, fallback to standard validator message
                if (
                  !msgTranslated ||
                  typeof msgTranslated !== 'string' ||
                  msgTranslated.startsWith('validation.custom.')
                ) {
                  const stdMsgKey = `validation.${validatorKey}`;
                  msgTranslated = i18n.t(stdMsgKey) as string;
                }

                // 3. Fallback to general errors.{key} or the raw keyword
                if (
                  !msgTranslated ||
                  typeof msgTranslated !== 'string' ||
                  msgTranslated.startsWith('validation.')
                ) {
                  // Final fallback to any possible existing key or the value itself
                  msgTranslated = i18n.t(`errors.${val}`) as string;
                  if (
                    !msgTranslated ||
                    typeof msgTranslated !== 'string' ||
                    msgTranslated.startsWith('errors.')
                  ) {
                    msgTranslated = val;
                  }
                }

                // Replace placeholders
                if (typeof msgTranslated === 'string') {
                  let finalMsg: string = msgTranslated;
                  finalMsg = finalMsg.replace('{attribute}', attrTranslated);
                  if (paramValue) {
                    // Replace min/max based on validator key
                    if (
                      validatorKey === 'min' ||
                      validatorKey === 'arrayMinSize'
                    ) {
                      finalMsg = finalMsg.replace('{min}', paramValue);
                    } else if (validatorKey === 'max') {
                      finalMsg = finalMsg.replace('{max}', paramValue);
                    }
                  }
                  msgTranslated = finalMsg;
                }

                result[key] = msgTranslated;
              } else {
                result[key] = val;
              }
            }
            return result;
          };

          translatedErrors = translateValidation(errors);
        }

        responseBody = JSONResponse.fail(
          translatedErrors || message,
          status,
          meta,
        );

        // Standardize the final structure to match docs (fail status have 'data' with errors/message)
        if (typeof errors === 'undefined' && typeof message === 'string') {
          responseBody.data = {
            message,
            statusCode: status,
            error: errorResponse.error || 'Bad Request',
          };
        }
      } else {
        // For server errors (5xx), use the error status
        responseBody = JSONResponse.error(message, status, meta);

        // Log server errors
        this.logger.error(
          `${request.method} ${request.url} - ${status} - ${message}`,
          (exception as Error).stack,
        );
      }
    } else {
      // For any other unexpected errors (e.g., database errors, type errors)
      const i18n = I18nContext.current(host);
      let message = (exception as any)?.message || 'Internal server error';

      if (i18n) {
        const translatedMessage = i18n.t('errors.server');
        if (
          typeof translatedMessage === 'string' &&
          !translatedMessage.startsWith('errors.')
        ) {
          message = translatedMessage;
        }
      }

      responseBody = JSONResponse.error(message, status, meta);

      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        (exception as Error).stack,
      );
    }

    response.status(status).json(responseBody);
  }
}
