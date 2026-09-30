export interface AdminSession {
  authenticated: boolean;
  username?: string;
  expires_at?: number;
}

interface AuthErrorBody {
  error?: {
    code?: string;
    message?: string;
  };
}

export class AdminAuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
  }
}

async function authRequest<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/json',
      ...init?.headers,
    },
  });

  const data = response.status === 204
    ? null
    : await response.json().catch(() => null) as T | AuthErrorBody | null;

  if (!response.ok) {
    const error = data as AuthErrorBody | null;
    throw new AdminAuthError(
      error?.error?.message ?? 'No se pudo validar la sesión.',
      response.status,
      error?.error?.code,
    );
  }

  return data as T;
}

export function fetchAdminSession() {
  return authRequest<AdminSession>('/api/auth/session');
}

export function loginAdmin(username: string, password: string) {
  return authRequest<AdminSession>('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function logoutAdmin() {
  await authRequest<null>('/api/auth/logout', { method: 'POST' });
}
