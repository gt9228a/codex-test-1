# Reading + Debrid API (MVP Prototype)

This repository now contains a runnable backend prototype for a Shelfmark/ReadMeABook-style app with built-in Debrid provider support.

## What is implemented

- ✅ Debrid provider abstraction (`DebridProvider`).
- ✅ TorBox provider adapter scaffold.
- ✅ In-memory library + resolve job store.
- ✅ HTTP API endpoints for:
  - provider credential validation
  - library create/list/update
  - candidate generation + resolve start + resolve status polling

## Quick start

```bash
npm start
```

Server starts on `http://localhost:3000`.

## Run with Docker

Build and run with Docker Compose:

```bash
docker compose up --build
```

Then access the API at `http://localhost:3000`.

## API examples

Health check:

```bash
curl http://localhost:3000/health
```

Validate TorBox API key:

```bash
curl -X POST http://localhost:3000/providers/torbox/validate \
  -H 'content-type: application/json' \
  -d '{"apiKey":"your-api-key-here"}'
```

Create a library book:

```bash
curl -X POST http://localhost:3000/library/books \
  -H 'content-type: application/json' \
  -d '{"title":"The Hobbit","author":"J.R.R. Tolkien"}'
```

Resolve candidates:

```bash
curl -X POST http://localhost:3000/resolve/candidates \
  -H 'content-type: application/json' \
  -d '{"title":"The Hobbit","author":"J.R.R. Tolkien"}'
```

## Next implementation steps

1. Replace in-memory store with PostgreSQL.
2. Wire real TorBox API calls in provider methods.
3. Add background queue workers for long-running downloads.
4. Add web frontend for library/progress UX.
