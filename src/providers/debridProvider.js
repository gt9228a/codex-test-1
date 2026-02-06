/**
 * @typedef {{ apiKey: string }} CredentialInput
 * @typedef {{ ok: boolean, accountTier?: string, expiresAt?: string, error?: string }} CredentialValidation
 * @typedef {{ infoHash: string, cached: boolean, variants?: Array<{ fileName: string, sizeBytes: number }> }} AvailabilityResult
 * @typedef {{ taskId: string, status: 'queued'|'downloading'|'ready'|'failed' }} AddMagnetResult
 * @typedef {{ taskId: string, status: 'queued'|'downloading'|'ready'|'failed', progressPct?: number, directLinks?: string[], error?: string }} TaskStatus
 */

class DebridProvider {
  constructor(id) {
    this.id = id;
  }

  /** @param {CredentialInput} _input @returns {Promise<CredentialValidation>} */
  async validateCredentials(_input) {
    throw new Error('validateCredentials is not implemented');
  }

  /** @param {{ infoHashes: string[] }} _input @returns {Promise<AvailabilityResult[]>} */
  async checkInstantAvailability(_input) {
    throw new Error('checkInstantAvailability is not implemented');
  }

  /** @param {{ magnetUri: string }} _input @returns {Promise<AddMagnetResult>} */
  async addMagnet(_input) {
    throw new Error('addMagnet is not implemented');
  }

  /** @param {{ taskId: string }} _input @returns {Promise<TaskStatus>} */
  async getTaskStatus(_input) {
    throw new Error('getTaskStatus is not implemented');
  }

  /** @param {{ url: string }} _input @returns {Promise<{ directUrl: string, fileName?: string, sizeBytes?: number }>} */
  async unrestrictLink(_input) {
    throw new Error('unrestrictLink is not implemented');
  }
}

module.exports = { DebridProvider };
