import { handleAdminApi } from './api/admin';
import { apiError, json } from './api/http';
import { handlePublicApi } from './api/public';
import { handlePublicMedia } from './media';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      if (pathname === '/api/health') {
        return json({
          ok: true,
          service: 'braimaru',
          mode: env.BRAIMARU_RESOURCE_MODE ?? 'development',
          bindings: {
            d1: Boolean(env.DB),
            r2: Boolean(env.MEDIA),
          },
        });
      }

      if (pathname.startsWith('/api/admin/')) {
        const response = await handleAdminApi(request, env, pathname);
        if (response) return response;
      }

      if (pathname === '/api/products' || pathname === '/api/categories' || pathname === '/api/site') {
        const response = await handlePublicApi(request, env, pathname);
        if (response) return response;
      }

      if (pathname.startsWith('/media/')) {
        const response = await handlePublicMedia(request, env, pathname);
        if (response) return response;
      }

      if (pathname.startsWith('/api/')) {
        return apiError(404, 'api_route_not_found', 'API route not found.');
      }

      return new Response('Not found', { status: 404 });
    } catch (error) {
      console.error('BRAIMARÚ Worker error', error);
      return apiError(500, 'internal_error', 'Unexpected server error.');
    }
  },
};
