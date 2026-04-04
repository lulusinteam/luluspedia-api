import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DomainScope } from './domain-scope.decorator';
import { Roles } from '../../modules/roles/roles.decorator';
import { RoleEnum } from '../../modules/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../modules/roles/roles.guard';

// Helper untuk menentukan apakah rute harus aktif berdasarkan Port atau Domain
const getHostConstraint = (envVar: string) => {
  const domain = process.env[envVar];
  if (!domain) return undefined;

  const isProd = process.env.NODE_ENV === 'production';
  const cleanedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Jika di Production (atau Docker satu kontainer), kita biarkan rute ini aktif 
  // dan biarkan Guard (DomainGuard) atau Host-Matching yang menanganinya.
  if (isProd) {
    return cleanedDomain;
  }

  // IN DEV: Bypass host constraint entirely to keep it flexible
  if (!isProd) {
    return undefined;
  }

  const currentAppPort = process.env.APP_PORT?.trim();
  const domainPort = cleanedDomain.split(':')[1]?.trim();

  /**
   * DI LOCAL (NON-DOCKER):
   * Jika Anda menjalankan proses terpisah dan port tidak cocok, matikan rute ini.
   * Tapi jika port di .env adalah 3000 (Docker Internal), jangan matikan.
   */
  if (currentAppPort && domainPort && currentAppPort !== domainPort && currentAppPort !== '3000') {
    // Allow localhost/127.0.0.1 without port restriction in local development
    if (cleanedDomain.includes('localhost') || cleanedDomain.includes('127.0.0.1')) {
      return undefined;
    }
    return 'unmatchable.local';
  }

  /**
   * FORMAT HOST UNTUK NESTJS v8 + PORT:
   * Kita pisahkan host dan port ke dalam parameter agar tidak crash
   */
  if (cleanedDomain.includes(':')) {
    const [h, p] = cleanedDomain.split(':');
    return `${h}:port{${p}}`;
  }

  return cleanedDomain;
};

export function AdminController(
  path: string | string[],
  options: { isPublic?: boolean; tagName?: string } = {},
) {
  const hostConstraint = getHostConstraint('BACKEND_DOMAIN_ADMIN');
  const tag = options.tagName || (Array.isArray(path) ? path[0] : path);

  const decorators = [
    Controller({
      path,
      host: hostConstraint,
      version: '1',
    }),
    ApiTags(`Admin | ${tag}`),
    DomainScope('admin'),
    ApiBearerAuth(),
  ];

  if (!options.isPublic) {
    decorators.push(
      Roles(RoleEnum.admin),
      UseGuards(AuthGuard('jwt'), RolesGuard),
    );
  }

  return applyDecorators(...decorators);
}

export function UserController(
  path: string | string[],
  options: { isPublic?: boolean; tagName?: string } = {},
) {
  const hostConstraint = getHostConstraint('BACKEND_DOMAIN');
  const tag = options.tagName || (Array.isArray(path) ? path[0] : path);

  const decorators = [
    Controller({
      path,
      host: hostConstraint,
      version: '1',
    }),
    ApiTags(`User | ${tag}`),
    DomainScope('user'),
    ApiBearerAuth(),
  ];

  if (!options.isPublic) {
    decorators.push(UseGuards(AuthGuard('jwt')));
  }

  return applyDecorators(...decorators);
}
