const crypto = require('node:crypto');
const { DebridProvider } = require('./debridProvider');

class TorboxProvider extends DebridProvider {
  constructor() {
    super('torbox');
    this.jobs = new Map();
  }

  async validateCredentials(input) {
    if (!input.apiKey || input.apiKey.length < 12) {
      return { ok: false, error: 'API key appears invalid.' };
    }

    return {
      ok: true,
      accountTier: 'unknown',
      expiresAt: undefined
    };
  }

  async checkInstantAvailability(input) {
    return input.infoHashes.map((infoHash) => ({
      infoHash,
      cached: this.#pseudoCached(infoHash),
      variants: this.#pseudoCached(infoHash)
        ? [{ fileName: `${infoHash}.epub`, sizeBytes: 1_500_000 }]
        : []
    }));
  }

  async addMagnet(input) {
    const taskId = crypto.randomUUID();
    this.jobs.set(taskId, {
      createdAt: Date.now(),
      magnetUri: input.magnetUri,
      status: 'queued'
    });

    return { taskId, status: 'queued' };
  }

  async getTaskStatus(input) {
    const job = this.jobs.get(input.taskId);
    if (!job) {
      return { taskId: input.taskId, status: 'failed', error: 'Task not found.' };
    }

    const elapsed = Date.now() - job.createdAt;
    if (elapsed > 3000) {
      return {
        taskId: input.taskId,
        status: 'ready',
        progressPct: 100,
        directLinks: [`https://torbox.example/download/${input.taskId}`]
      };
    }

    if (elapsed > 1000) {
      return { taskId: input.taskId, status: 'downloading', progressPct: 60 };
    }

    return { taskId: input.taskId, status: 'queued', progressPct: 0 };
  }

  async unrestrictLink(input) {
    return {
      directUrl: input.url,
      fileName: 'asset.bin',
      sizeBytes: 1_500_000
    };
  }

  #pseudoCached(infoHash) {
    const tail = infoHash.slice(-1).toLowerCase();
    return ['0', '2', '4', '6', '8', 'a', 'c', 'e'].includes(tail);
  }
}

module.exports = { TorboxProvider };
