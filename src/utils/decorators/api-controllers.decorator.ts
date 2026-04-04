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

  // Jika di Production, gunakan Host Matching (Standard)
  if (isProd) {
    return cleanedDomain;
  }

  /**
   * DI LOCAL: Kita gunakan trik cerdas.
   * Karena Anda menjalankan 2 instance terpisah (Port 3002 & 7000),
   * kita cek apakah port di Domain cocok dengan APP_PORT saat ini.
   */
  const currentAppPort = process.env.APP_PORT?.trim();
  const domainPort = cleanedDomain.split(':')[1]?.trim();

  if (currentAppPort && domainPort && currentAppPort !== domainPort) {
    /**
     * Jika port tidak cocok, kita kasih Host yang mustahil (UNMATCHABLE)
     * agar rute ini tidak muncul di instance ini.
     */
    return 'unmatchable.local';
  }

  // Jika port cocok atau tidak ada port, biarkan rute ini aktif (undefined host = match all)
  return undefined;
};

export function AdminController(
  path: string | string[],
  options: { isPublic?: boolean } = {},
) {
  const hostConstraint = getHostConstraint('BACKEND_DOMAIN_ADMIN');

  const decorators = [
    Controller({
      path,
      host: hostConstraint,
      version: '1',
    }),
    ApiTags(`Admin | ${Array.isArray(path) ? path[0] : path}`),
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

export function UserController(path: string | string[]) {
  const hostConstraint = getHostConstraint('BACKEND_DOMAIN');

  return applyDecorators(
    Controller({
      path,
      host: hostConstraint,
      version: '1',
    }),
    ApiTags(`User | ${Array.isArray(path) ? path[0] : path}`),
    DomainScope('user'),
  );
}
