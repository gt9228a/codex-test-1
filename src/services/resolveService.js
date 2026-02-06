const crypto = require('node:crypto');

class ResolveService {
  constructor(store, provider) {
    this.store = store;
    this.provider = provider;
  }

  async createCandidates(input) {
    const query = `${input.title || ''} ${input.author || ''} ${input.isbn || ''}`.trim();
    if (!query) {
      throw new Error('At least one of title, author, or isbn is required.');
    }

    const infoHash = crypto.createHash('sha1').update(query).digest('hex');
    const availability = await this.provider.checkInstantAvailability({ infoHashes: [infoHash] });

    return availability.map((result) => ({
      id: crypto.randomUUID(),
      providerId: this.provider.id,
      infoHash: result.infoHash,
      cached: result.cached,
      score: result.cached ? 100 : 35,
      variants: result.variants || []
    }));
  }

  async startResolve(candidate) {
    const job = this.store.createResolveJob({ candidate, status: 'resolving' });

    if (!candidate.cached) {
      this.store.updateResolveJob(job.id, {
        status: 'failed',
        error: 'Candidate is not instantly cached on the provider.'
      });
      return this.store.getResolveJob(job.id);
    }

    const task = await this.provider.addMagnet({ magnetUri: `magnet:?xt=urn:btih:${candidate.infoHash}` });
    this.store.updateResolveJob(job.id, { providerTaskId: task.taskId, status: task.status });
    return this.store.getResolveJob(job.id);
  }

  async pollResolveJob(id) {
    const job = this.store.getResolveJob(id);
    if (!job) return null;

    if (!job.providerTaskId) return job;

    const status = await this.provider.getTaskStatus({ taskId: job.providerTaskId });
    const next = {
      status: status.status,
      progressPct: status.progressPct,
      directLinks: status.directLinks,
      error: status.error
    };

    return this.store.updateResolveJob(id, next);
  }
}

module.exports = { ResolveService };
