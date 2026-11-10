/**
 * Cloudflare Worker: web Astro estàtica + API de finançament.
 * Les dades personals no s'exposen en endpoints GET.
 */
import { onRequestPost } from '../functions/api/financing';

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  FINANCING_RATE_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
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
      // Màxim aproximat de 5 intents per minut i origen (per ubicació Cloudflare).
      // No guardem l'adreça IP en D1 ni la registrem en logs.
      const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.FINANCING_RATE_LIMITER.limit({ key: `financing:${clientIp}` });
      if (!success) {
        return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            'Retry-After': '60',
          },
        });
      }
      return onRequestPost({ request, env });
    }
    // Mai mostrar contingut de l'API amb un fallback al frontend.
    if (path.startsWith('/api/')) return jsonError('not_found', 404);
    return env.ASSETS.fetch(request);
  },
};
