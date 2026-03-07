---
trigger: always_on
---

# Project Rules

> [!IMPORTANT]
> **CRITICAL PRIORITIES (WAJIB UTAMAKAN):**
> 1. **PERFORMANCE**: Query optimization and resource efficiency are non-negotiable.
> 2. **SECURITY**: Security-first mindset in every endpoint and data flow.
> 3. **CLEAN CODE**: Strictly follow DRY (Don't Repeat Yourself) and avoid Spaghetti Code. Keep logic flat and modular.
>
> Failure to satisfy these core priorities will result in immediate PR rejection.


---

## Table of Contents <!-- omit in toc -->

- [Purpose](#purpose)
- [Core Principles](#core-principles)
- [Module Structure](#module-structure)
- [Coding Standards](#coding-standards)
- [Performance & Security](#performance--security)
- [Request & Response Rules](#request--response-rules)
- [Validation & DTOs](#validation--dtos)
- [Persistence & Migrations](#persistence--migrations)
- [Configuration & Secrets](#configuration--secrets)
- [Testing Strategy](#testing-strategy)
- [Logging & Observability](#logging--observability)
- [Documentation & Tooling](#documentation--tooling)

---

## Purpose

This document establishes the authoritative checklist for contributing to the NestJS codebase. It complements the guides in `docs/` by prescribing **how** we apply Hexagonal Architecture, the service/repository split, and our API contract (JSend-compatible JSON responses with `meta`). No feature is "definition of done" unless it satisfies every applicable rule below.

---

## Core Principles

1. **Hexagonal by default** – Business logic lives in domain/services, infrastructure concerns sit behind ports/adapters. Reference `docs/architecture.md` before starting any feature.
2. **Feature isolation** – Each bounded context has its own module with explicit exports. Shared utilities live in dedicated libraries; avoid deep relative imports between features.
3. **Dependency inversion** – Inject abstractions (ports) into services. Never instantiate repositories, senders, or gateways directly inside services.
4. **Consistency over cleverness** – Match existing patterns (naming, folder layout, DTO shapes) even when alternatives look "cleaner".
5. **Tests + docs + spec** – Code without matching tests, OpenAPI updates, and documentation is incomplete.
6. **PERFORMANCE & Efficiency (WAJIB)** – Mandatory consideration for query optimization, memory usage, and execution time.
7. **SECURITY First (WAJIB)** – Every endpoint and data flow must be assessed for vulnerabilities (Injection, XSS, CSRF, etc.) by default.

---

## Module Structure

Use the following minimal layout when scaffolding a feature (document and relational persistence folders included as needed):

```txt
src/modules/<feature>/
├── domain
│   └── <entity>.ts
├── dto
│   ├── create-<feature>.dto.ts
│   ├── update-<feature>.dto.ts
│   └── filters-<feature>.dto.ts
├── infrastructure
│   └── persistence
│       ├── document
│       │   ├── entities
│       │   ├── mappers
│       │   └── <feature>-document.repository.ts
│       └── relational
│           ├── entities
│           ├── mappers
│           └── <feature>-relational.repository.ts
├── <feature>.controller.ts
├── <feature>.service.ts
└── <feature>.module.ts
```

- **Controller**: obtains validated DTOs, calls the service, maps results to the canonical response shape only.
- **Service**: orchestrates domain logic, coordinates repositories/providers, and returns domain entities or DTOs (never HTTP objects).
- **Repository Port**: defined close to the domain (`infrastructure/persistence/<feature>.repository.ts`) and injected via interfaces.
- **Entity files**: follow `rules.mdc` naming (e.g., `user.entity.ts`, `user.schema.ts`).

When adding routes:

- Register controllers via feature modules, not the root `AppModule`.
- Keep route naming consistent (e.g., `workspace-by-domain` instead of `/workspaces/by-domain`).
- Update Swagger decorators and `openapi-schema.json` by running the export script once the implementation is ready.

---

## Coding Standards

1. **Type safety** – Leverage strict TypeScript (see `tsconfig.json`). No `any`/`unknown` unless guarded.
2. **Linting/formatting** – Run `pnpm lint` and `pnpm format` before raising a PR; ESLint + Prettier are the single source of truth.
3. **Error handling** – Throw Nest HTTP exceptions or domain-specific errors mapped in exception filters; never leak raw database or third-party errors.
4. **Clean code (WAJIB: DRY & Flat)** – Mandatory adherence to DRY (Don't Repeat Yourself). Avoid "Spaghetti Code" by keeping functions small, focused, and flat. If a logic branch is too deep or a function exceeds ~30 lines, refactor into smaller private methods or domain helpers. NO EXCEPTION for messy control flow.
5. **Async boundaries** – Use `async/await`; avoid mixing with `.then`. Always handle promise rejections.
6. **Comments** – Reserve comments for non-obvious intent or cross-cutting caveats; prefer expressive names otherwise.

---

## Performance & Security

1. **Query Optimization** – Avoid N+1 problems; use `joins` or `select` specific fields. Ensure every repeated query has a corresponding database index.
2. **Resource Management** – Limit large data sets using pagination (`Take`/`Skip`). Never fetch all records into memory.
3. **Input Sanitization** – Trust no one. All inputs must be strictly typed and validated via DTOs.
4. **Secret Management** – Never hardcode credentials. Use `ConfigService` and ensure `.env` is never committed.
5. **Rate Limiting & Auth** – Protect public/sensitive endpoints with appropriate guards and rate limiters to prevent DoS/Brute-force.
6. **Data Privacy** – Mask or exclude sensitive fields (passwords, tokens, PII) in responses using interceptors or explicit DTOs.

---

## Request & Response Rules

We standardize on `JSONResponse` utilities (see `docs/json-response-format.md`) with explicit `meta`. Every successful handler must:

- Return `JSONResponse.success({ data, meta })` (or `created`, `accepted`) with the correct HTTP status (200/201/202, etc.).
- Provide a `meta` object, even if empty `{}`.
- Serialize dates as ISO strings; convert to `DD Month YYYY` only in presentation layers.
- Ensure serialization respects interceptors described in `docs/serialization.md` (e.g., class-transformer usage).

For errors:

- Use `JSONResponse.error` helpers to maintain JSend semantics.
- Include `meta.correlationId` when available from the request scope.

---

## Validation & DTOs

1. **DTO classes** – All incoming payloads must be represented by DTOs annotated with `class-validator` + `class-transformer` decorators.
2. **Pipes** – Enable `ValidationPipe` with `{ whitelist: true, forbidNonWhitelisted: true }` at the controller level when feature-specific overrides are required.
3. **Enum reuse** – Centralize enums (e.g., `src/roles/roles.enum.ts`) and import them into DTOs to prevent drift.
4. **Response DTOs** – Create explicit response DTOs for non-trivial projections; avoid returning raw entities from services.

---

## Persistence & Migrations

1. **ORM adapters** – Align with the configured adapters (TypeORM for relational, Mongoose for document). Keep mapping logic in dedicated mapper classes.
2. **Transactions** – Use repository-level transactions for multi-entity operations; never rely on cascading side effects.
3. **Seeds** – Place seed services under `src/database/seeds/<context>/` and keep them idempotent.
4. **Migrations** – Generate migrations via the official CLI, review them into version control, and document breaking changes in `CHANGELOG.md`.

---

## Configuration & Secrets

1. **Env files** – Maintain a single `.env` plus `.env.example` snapshot. Do not introduce `.env.dev` / `.env.prod` variants.
2. **Config modules** – Use Nest `ConfigModule` + schema validation for every new configuration namespace.
3. **Docker mounting** – Ensure all services mount the project into `/app` consistently across `docker-compose.*.yaml` files.
4. **Feature flags** – Declare typed config providers; avoid ad-hoc `process.env` usage beyond the config layer.

---

## Testing Strategy

1. **Unit tests** – Required for services, repositories, and critical utilities. Mock infrastructure via ports.
2. **E2E tests** – Cover public API happy-paths and regressions. Use the provided testing docker-compose stack.
3. **Factories** – Build test data with Faker-based factories for readability; place them under `test/factories`.
4. **CI gating** – A PR must keep `pnpm test`, `pnpm test:e2e`, and linters green.
5. **Coverage** – Target ≥80% statement/branch coverage for new modules; justify deviations in the PR description.

---

## Logging & Observability

1. **Structured logs** – Use the shared logger provider; log JSON objects with `context`, `message`, and `meta` fields.
2. **Levels** – `debug` for verbose diagnostics (disabled in prod), `log`/`info` for lifecycle events, `warn` for recoverable issues, `error` for failures surfaced to operators.
3. **Tracing** – Propagate correlation/request IDs through services and include them in response `meta` and log entries.
4. **Metrics** – When exposing new long-running processes, add counters/histograms through the observability module (if applicable) or document planned instrumentation.

---

## Documentation & Tooling

1. **Docs first** – Update or create docs under `docs/` whenever introducing or changing behavior. Cross-link related guides.
2. **OpenAPI** – Run `pnpm export:schema` (see `export-openapi-schema.md`) after route changes and commit the regenerated schema.
3. **CLI** – Prefer Nest CLI generators plus custom schematics for hexagonal scaffolding (documented in `docs/cli.md`).
4. **Changelog** – Record user-visible changes in `CHANGELOG.md` using Keep a Changelog conventions.
5. **Issue templates** – When creating tasks, reference the relevant rule IDs from this document to speed up reviews.

---

Adhering to these rules keeps the codebase predictable, testable, and onboarding-friendly. When in doubt, open a short architecture discussion before writing code; aligning early is cheaper than rewriting later.

