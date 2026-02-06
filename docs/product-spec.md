# Product Spec (MVP)

## Problem statement

Users want one app that combines discovery, reading progress, and practical file retrieval for books/audiobooks. Existing tools either focus on management UX or media retrieval, but rarely both with first-class Debrid support.

## Core personas

- **Collector**: imports wishlists and manages a large personal library.
- **Daily reader**: wants “find + open + continue where I left off”.
- **Audiobook listener**: wants fast source resolution and playback handoff.

## MVP requirements

### 1) Library + progress

- Create, import, and manage book entries.
- Status: `to_read`, `reading`, `finished`, `dropped`.
- Progress by page/percentage/time position.

### 2) Source resolution with Debrid

- Provider settings page with encrypted API keys.
- Query provider for cached availability.
- Show “best source” ranking (quality, seed health proxy, file size).
- One-click resolve into direct downloadable stream.

### 3) Download and delivery

- Queue downloads per user.
- Track `queued`, `resolving`, `downloading`, `ready`, `failed`.
- Expose ready assets to integrated readers/players.

### 4) Basic discovery and metadata

- Manual search by title/author/ISBN.
- Cover + metadata enrichment.
- Duplicate detection by ISBN/work ID.

## Out of scope (post-MVP)

- Social feed/recommendations.
- Multi-tenant enterprise controls.
- Fully automated private indexer scraping.

## Success metrics

- Time from search to ready file under 60 seconds for cached sources.
- 90%+ successful resolve rate for valid content identifiers.
- Return users continue sessions with restored progress.
