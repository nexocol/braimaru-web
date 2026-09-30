export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

export function apiError(status: number, code: string, message: string, details?: unknown) {
  return json(
    {
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status },
  );
}

export async function readJsonBody<T>(request: Request): Promise<T | null> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) return null;

  try {
    const value: unknown = await request.json();
    return value as T;
  } catch {
    return null;
  }
}
