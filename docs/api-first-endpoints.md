# API-first endpoint draft

## Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`

## Provider Accounts

- `GET /providers`
- `POST /providers/:providerId/connect`
- `POST /providers/:providerId/validate`
- `DELETE /providers/:providerId`

## Library

- `GET /library`
- `POST /library/import`
- `POST /library/books`
- `PATCH /library/items/:itemId`

## Discovery + Resolve

- `GET /search/books?q=`
- `POST /resolve/candidates`
- `POST /resolve/:candidateId/start`
- `GET /resolve/jobs/:jobId`

## Downloads + Assets

- `POST /downloads`
- `GET /downloads/:jobId`
- `GET /assets/:assetId`
- `GET /assets/:assetId/stream`

## Progress

- `POST /progress/events`
- `GET /progress/:libraryItemId`
