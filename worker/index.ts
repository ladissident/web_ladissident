/**
 * Cloudflare Worker: web Astro estàtica + API de finançament.
 * Les dades personals no s'exposen en endpoints GET.
 */
import { onRequestPost } from '../functions/api/financing';

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const jsonError = (error: string, status: number): Response =>
  Response.json({ ok: false, error }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === '/api/financing' || path === '/api/financing/') {
      if (request.method !== 'POST') {
        return jsonError('method_not_allowed', 405);
      }
      return onRequestPost({ request, env });
    }
    // Mai mostrar contingut de l'API amb un fallback al frontend.
    if (path.startsWith('/api/')) return jsonError('not_found', 404);
    return env.ASSETS.fetch(request);
  },
};
