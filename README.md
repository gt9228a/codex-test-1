# Shelfmark + Debrid App Blueprint

This repository now contains a concrete build plan for an app inspired by:

- https://github.com/calibrain/shelfmark
- https://github.com/kikootwo/ReadMeABook

## Product goal

Build a self-hostable reading + listening workflow app that can:

1. Track books, reading status, and progress.
2. Ingest from user libraries and watchlists.
3. Resolve downloadable/cached sources via Debrid providers (TorBox first, then others).
4. Send files/streams to reading clients (web reader, Audiobookshelf, Kavita, etc.).

## What is included

- `docs/product-spec.md`: MVP and feature scope.
- `docs/system-architecture.md`: Backend/services architecture.
- `docs/debrid-provider-contract.md`: provider adapter interface and normalization rules.
- `docs/api-first-endpoints.md`: API endpoint draft for building the backend first.

## Suggested implementation stack

- **Frontend**: Next.js + TypeScript + Tailwind.
- **Backend API**: Fastify (or NestJS) + TypeScript.
- **Jobs/Workers**: BullMQ + Redis.
- **Database**: PostgreSQL + Prisma.
- **Auth**: NextAuth/Auth.js (OAuth + local).
- **Storage**: S3-compatible + local filesystem fallback.

## Next steps

1. Scaffold monorepo (`apps/web`, `apps/api`, `packages/core`).
2. Implement Debrid adapter abstraction and TorBox adapter.
3. Add metadata ingestion (OpenLibrary/Google Books).
4. Add queue-based download + transcoding pipeline.
5. Ship MVP dashboard and library views.
