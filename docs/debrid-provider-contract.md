# Debrid Provider Contract

Define a provider-agnostic interface so TorBox, Real-Debrid, Premiumize, etc. can be swapped without changing business logic.

## Interface (TypeScript-style)

```ts
export interface DebridProvider {
  id: 'torbox' | 'realdebrid' | 'premiumize' | string;

  validateCredentials(input: { apiKey: string }): Promise<{
    ok: boolean;
    accountTier?: string;
    expiresAt?: string;
    error?: string;
  }>;

  checkInstantAvailability(input: {
    infoHashes: string[];
  }): Promise<Array<{
    infoHash: string;
    cached: boolean;
    variants?: Array<{ fileName: string; sizeBytes: number }>;
  }>>;

  addMagnet(input: { magnetUri: string }): Promise<{
    taskId: string;
    status: 'queued' | 'downloading' | 'ready' | 'failed';
  }>;

  getTaskStatus(input: { taskId: string }): Promise<{
    taskId: string;
    status: 'queued' | 'downloading' | 'ready' | 'failed';
    progressPct?: number;
    directLinks?: string[];
    error?: string;
  }>;

  unrestrictLink(input: { url: string }): Promise<{
    directUrl: string;
    fileName?: string;
    sizeBytes?: number;
  }>;
}
```

## Normalization rules

- Standardize provider-specific states into: `queued`, `resolving`, `downloading`, `ready`, `failed`.
- Keep raw provider payload for debugging (`raw_response` JSONB).
- All file sizes normalized to bytes.
- All timestamps stored as UTC ISO strings.

## Security notes

- Encrypt API keys at rest.
- Redact secrets in logs.
- Never expose provider keys to frontend clients.
