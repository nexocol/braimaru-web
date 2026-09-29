import { getAdminAuthConfig } from '../auth/config';
import { verifyPassword } from '../auth/password';
import {
  clearSessionCookie,
  createSessionCookie,
  createSessionToken,
  getSessionFromRequest,
} from '../auth/session';
import type { Env } from '../types';
import { apiError, json, readJsonBody } from './http';

const INVALID_LOGIN_MESSAGE = 'Usuario o contraseña incorrectos.';
const FAILED_LOGIN_DELAY_MS = 650;

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function handleAuthApi(request: Request, env: Env, pathname: string) {
  if (!pathname.startsWith('/api/auth/')) return null;

  const config = getAdminAuthConfig(env);
  if (!config) {
    return apiError(
      503,
      'auth_not_configured',
      'La autenticación administrativa todavía no está configurada.',
    );
  }

  if (pathname === '/api/auth/login') {
    if (request.method !== 'POST') {
      return apiError(405, 'method_not_allowed', 'Method not allowed.');
    }

    const raw = await readJsonBody<LoginBody>(request);
    const username = typeof raw?.username === 'string' ? raw.username : '';
    const password = typeof raw?.password === 'string' ? raw.password : '';

    const passwordValid = await verifyPassword(password, config.passwordHash);
    const usernameValid = username === config.username;

    if (!passwordValid || !usernameValid) {
      await sleep(FAILED_LOGIN_DELAY_MS);
      return apiError(401, 'invalid_credentials', INVALID_LOGIN_MESSAGE);
    }

    const token = await createSessionToken(config.username, config.sessionSecret);
    return json(
      {
        authenticated: true,
        username: config.username,
      },
      {
        headers: {
          'set-cookie': createSessionCookie(token),
          'cache-control': 'no-store',
        },
      },
    );
  }

  if (pathname === '/api/auth/logout') {
    if (request.method !== 'POST') {
      return apiError(405, 'method_not_allowed', 'Method not allowed.');
    }

    return new Response(null, {
      status: 204,
      headers: {
        'set-cookie': clearSessionCookie(),
        'cache-control': 'no-store',
      },
    });
  }

  if (pathname === '/api/auth/session') {
    if (request.method !== 'GET') {
      return apiError(405, 'method_not_allowed', 'Method not allowed.');
    }

    const session = await getSessionFromRequest(
      request,
      config.username,
      config.sessionSecret,
    );

    if (!session) {
      return json(
        { authenticated: false },
        {
          status: 401,
          headers: { 'cache-control': 'no-store' },
        },
      );
    }

    return json(
      {
        authenticated: true,
        username: session.sub,
        expires_at: session.exp,
      },
      { headers: { 'cache-control': 'no-store' } },
    );
  }

  return apiError(404, 'auth_route_not_found', 'Auth API route not found.');
}
