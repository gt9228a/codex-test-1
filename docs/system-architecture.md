# System Architecture

## High-level components

1. **Web App (Next.js)**
   - User auth, library UI, settings, progress updates.
2. **API Service (TypeScript)**
   - CRUD for books/progress.
   - Debrid orchestration.
   - Job creation and webhook handling.
3. **Worker Service**
   - Source resolution retries.
   - Download + optional conversion tasks.
4. **PostgreSQL**
   - Users, books, library items, source records, jobs.
5. **Redis**
   - Queue transport, rate-limits, short-lived cache.
6. **Object Storage**
   - Final artifacts and temporary download buffers.

## Data model sketch

- `users`
- `provider_accounts` (encrypted credentials, quotas, health)
- `books` (canonical metadata)
- `library_items` (user-book relationship + status)
- `sources` (magnet/hash/provider/raw attrs)
- `resolve_jobs`
- `download_jobs`
- `assets` (epub/pdf/m4b/mp3 links + checksums)
- `progress_events`

## Critical flows

### A) Resolve source

1. User selects a book.
2. API generates candidate identifiers (ISBN/title/author hash queries).
3. Provider adapter fetches candidates + cached availability.
4. Scoring engine ranks candidate list.
5. Top result is resolved to direct link.

### B) Download pipeline

1. API enqueues `download_job`.
2. Worker streams file into storage.
3. Worker validates checksum and media format.
4. Asset marked `ready`; user notified.

## Operational guardrails

- Per-provider rate limiter.
- Credential validation and periodic health checks.
- Retry with exponential backoff and provider fallback.
- Audit log for provider actions and errors.
