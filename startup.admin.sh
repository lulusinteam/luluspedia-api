#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
pnpm run start:prod:admin
