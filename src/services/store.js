const crypto = require('node:crypto');

class Store {
  constructor() {
    this.books = new Map();
    this.libraryItems = new Map();
    this.resolveJobs = new Map();
  }

  createBook(input) {
    const id = crypto.randomUUID();
    const created = { id, ...input, createdAt: new Date().toISOString() };
    this.books.set(id, created);
    return created;
  }

  addLibraryItem(input) {
    const id = crypto.randomUUID();
    const item = { id, ...input, updatedAt: new Date().toISOString() };
    this.libraryItems.set(id, item);
    return item;
  }

  listLibrary() {
    return Array.from(this.libraryItems.values());
  }

  updateLibraryItem(id, patch) {
    const existing = this.libraryItems.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    this.libraryItems.set(id, updated);
    return updated;
  }

  createResolveJob(input) {
    const id = crypto.randomUUID();
    const job = { id, status: 'queued', ...input, createdAt: new Date().toISOString() };
    this.resolveJobs.set(id, job);
    return job;
  }

  updateResolveJob(id, patch) {
    const current = this.resolveJobs.get(id);
    if (!current) return null;
    const next = { ...current, ...patch };
    this.resolveJobs.set(id, next);
    return next;
  }

  getResolveJob(id) {
    return this.resolveJobs.get(id) || null;
  }
}

module.exports = { Store };
