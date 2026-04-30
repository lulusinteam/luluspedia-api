#!/usr/bin/env bash
set -e

# Wait for PostgreSQL to be ready (optional, can be used in Kubernetes/compose)
/opt/wait-for-it.sh postgres:5432

# Run database migrations for production
pnpm run migration:run:prod

# Seed admin user only on first start
if [ ! -f /opt/.admin_seed_done ]; then
  pnpm run seed:admin:prod
  touch /opt/.admin_seed_done
fi

# Start the NestJS application in production mode
pnpm run start:prod
