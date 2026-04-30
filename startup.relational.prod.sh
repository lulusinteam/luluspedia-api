#!/usr/bin/env bash
set -e

# Wait for PostgreSQL to be ready (optional, can be used in Kubernetes/compose)
/opt/wait-for-it.sh postgres:5432

# Run database migrations for production
pnpm run migration:run:prod


# Start the NestJS application in production mode
pnpm run start:prod
