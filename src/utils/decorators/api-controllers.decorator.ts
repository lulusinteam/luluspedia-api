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

  // In production, always use the strict domain constraint
  if (isProd) {
    return cleanedDomain;
  }

  const currentAppPort = process.env.APP_PORT?.trim();
  const domainPort = cleanedDomain.split(':')[1]?.trim();

  /**
   * DOCKER / UNIFIED MODE (Port 3000):
   * Jika running di port 3000, berarti satu proses menangani semua domain.
   * Aktifkan Host-based routing secara ketat.
   */
  if (currentAppPort === '3000') {
    return cleanedDomain;
  }

  /**
   * ISOLATED PROCESS MODE (e.g. port 7000 or 3002):
   * Jika port tidak cocok, kita matikan rute ini (return unmatchable).
   * Ini mencegah UserController (3002) 'mencuri' rute dari AdminController (7000) di AppModule.
   */
  if (currentAppPort && domainPort && currentAppPort !== domainPort) {
    return 'unmatchable.local';
  }

  /**
   * Jika port cocok, kita return undefined agar rute aktif di port ini
   * tapi FLEKSIBEL terhadap hostname (localhost/127.0.0.1/IP tetap bisa).
   */
  return undefined;
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
