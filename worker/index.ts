import { getAdminAuthConfig } from './auth/config';
import { getSessionFromRequest } from './auth/session';
import { handleAdminApi } from './api/admin';
import { handleAuthApi } from './api/auth';
import { apiError, json } from './api/http';
import { handlePublicApi } from './api/public';
import { handlePublicMedia } from './media';
import type { Env } from './types';

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: {
      location,
      'cache-control': 'no-store',
    },
  });
}

async function handleAdminDocument(request: Request, env: Env, pathname: string) {
  if (!env.ASSETS) {
    return apiError(500, 'assets_unavailable', 'Static assets binding is unavailable.');
  }

  const config = getAdminAuthConfig(env);
  const session = config
    ? await getSessionFromRequest(request, config.username, config.sessionSecret)
    : null;

  if (pathname === '/admin/login') {
    if (session) return redirect('/admin');
    return env.ASSETS.fetch(request);
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!session) return redirect('/admin/login');
    return env.ASSETS.fetch(request);
  }

  return null;
}

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

      if (pathname.startsWith('/api/auth/')) {
        const response = await handleAuthApi(request, env, pathname);
        if (response) return response;
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

      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        const response = await handleAdminDocument(request, env, pathname);
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
