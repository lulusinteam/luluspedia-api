#!/usr/bin/env bash
set -e

pnpm run migration:run
pnpm run seed:run:relational
pnpm run start:prod
