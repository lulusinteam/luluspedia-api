import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  DOMAIN_SCOPE_KEY,
  DomainScopeType,
} from '../decorators/domain-scope.decorator';
import { AllConfigType } from '../../config/config.type';

@Injectable()
export class DomainGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService<AllConfigType>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const scope = this.reflector.getAllAndOverride<DomainScopeType>(
      DOMAIN_SCOPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no scope is defined, allow access (or you can default to 'user')
    if (!scope) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const currentHost = request.headers.host; // e.g. "api.luluspedia.com" or "localhost:3002"


    // Clean up domains from config (strip http/https and trailing slashes)
    const adminDomain = this.configService
      .get('app.backendDomainAdmin', { infer: true })
      ?.replace(/^https?:\/\//, '')
      .replace(/\/$/, ''); // localhost:7000

    const userDomain = this.configService
      .get('app.backendDomain', { infer: true })
      ?.replace(/^https?:\/\//, '')
      .replace(/\/$/, ''); // localhost:3002


    if (scope === 'admin') {
      if (
        currentHost !== adminDomain &&
        process.env.NODE_ENV === 'production'
      ) {
        throw new NotFoundException(
          'Admin resources are not available on this domain.',
        );
      }
      // Optional: Add strict check for local dev if you want to be extremely disciplined
      if (
        process.env.NODE_ENV !== 'production' &&
        currentHost !== adminDomain
      ) {
        throw new NotFoundException(
          `Admin resources only available on ${adminDomain}`,
        );
      }
    }

    if (scope === 'user') {
      if (currentHost !== userDomain && process.env.NODE_ENV === 'production') {
        throw new NotFoundException(
          'User resources are not available on this domain.',
        );
      }
      if (process.env.NODE_ENV !== 'production' && currentHost !== userDomain) {
        throw new NotFoundException(
          `User resources only available on ${userDomain}`,
        );
      }
    }

    return true;
  }
}
