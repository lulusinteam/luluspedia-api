#!/usr/bin/env bash
set -e

pnpm run migration:run:prod
pnpm run seed:run:relational:prod
pnpm run start:prod
