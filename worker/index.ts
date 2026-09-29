export interface Env {
  BRAIMARU_RESOURCE_MODE?: 'development' | 'preview' | 'production';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({
        ok: true,
        service: 'braimaru',
        mode: env.BRAIMARU_RESOURCE_MODE ?? 'development',
      });
    }

    if (url.pathname.startsWith('/api/')) {
      return Response.json(
        { error: 'API route not implemented in foundation sprint' },
        { status: 501 },
      );
    }

    return new Response('Not found', { status: 404 });
  },
};
