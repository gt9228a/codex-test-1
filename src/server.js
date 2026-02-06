const http = require('node:http');
const { URL } = require('node:url');
const { TorboxProvider } = require('./providers/torboxProvider');
const { Store } = require('./services/store');
const { ResolveService } = require('./services/resolveService');
const { parseJsonBody, sendJson } = require('./utils/http');

const store = new Store();
const provider = new TorboxProvider();
const resolveService = new ResolveService(store, provider);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      return sendJson(res, 200, { ok: true, service: 'reading-debrid-api' });
    }

    if (req.method === 'POST' && url.pathname === '/providers/torbox/validate') {
      const body = await parseJsonBody(req);
      const result = await provider.validateCredentials({ apiKey: body.apiKey || '' });
      return sendJson(res, result.ok ? 200 : 400, result);
    }

    if (req.method === 'POST' && url.pathname === '/library/books') {
      const body = await parseJsonBody(req);
      const book = store.createBook({
        title: body.title || 'Untitled',
        author: body.author || 'Unknown',
        isbn: body.isbn || null
      });
      const item = store.addLibraryItem({ bookId: book.id, status: 'to_read', progress: 0 });
      return sendJson(res, 201, { book, libraryItem: item });
    }

    if (req.method === 'GET' && url.pathname === '/library') {
      return sendJson(res, 200, { items: store.listLibrary() });
    }

    if (req.method === 'PATCH' && url.pathname.startsWith('/library/items/')) {
      const itemId = url.pathname.split('/').pop();
      const body = await parseJsonBody(req);
      const updated = store.updateLibraryItem(itemId, {
        status: body.status,
        progress: body.progress
      });
      if (!updated) return sendJson(res, 404, { error: 'Library item not found.' });
      return sendJson(res, 200, updated);
    }

    if (req.method === 'POST' && url.pathname === '/resolve/candidates') {
      const body = await parseJsonBody(req);
      const candidates = await resolveService.createCandidates(body);
      return sendJson(res, 200, { candidates });
    }

    if (req.method === 'POST' && url.pathname === '/resolve/start') {
      const body = await parseJsonBody(req);
      const job = await resolveService.startResolve(body.candidate);
      return sendJson(res, 202, { job });
    }

    if (req.method === 'GET' && url.pathname.startsWith('/resolve/jobs/')) {
      const jobId = url.pathname.split('/').pop();
      const job = await resolveService.pollResolveJob(jobId);
      if (!job) return sendJson(res, 404, { error: 'Resolve job not found.' });
      return sendJson(res, 200, { job });
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Unknown error' });
  }
});

const PORT = Number(process.env.PORT || 3000);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
