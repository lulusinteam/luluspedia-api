import { SetMetadata } from '@nestjs/common';

export type DomainScopeType = 'user' | 'admin';

export const DOMAIN_SCOPE_KEY = 'domain_scope';
export const DomainScope = (scope: DomainScopeType) =>
  SetMetadata(DOMAIN_SCOPE_KEY, scope);
