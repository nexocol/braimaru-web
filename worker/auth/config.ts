import type { Env } from '../types';

export interface AdminAuthConfig {
  username: string;
  passwordHash: string;
  sessionSecret: string;
}

export function getAdminAuthConfig(env: Env): AdminAuthConfig | null {
  const username = env.ADMIN_USERNAME?.trim();
  const passwordHash = env.ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = env.ADMIN_SESSION_SECRET?.trim();

  if (!username || !passwordHash || !sessionSecret || sessionSecret.length < 32) {
    return null;
  }

  return {
    username,
    passwordHash,
    sessionSecret,
  };
}
