# Cloudflare Access boundary

Before administrative writes are enabled in a remote environment, Cloudflare Access must protect:

- `/admin`
- `/admin/*`
- `/api/admin`
- `/api/admin/*`

The Worker additionally denies `/api/admin/*` outside local development unless a Cloudflare Access identity header is present.

No application-owned user/password system is implemented.

Preview and production resources must stay isolated:

- Production D1: `braimaru-db`
- Production R2: `braimaru-media`
- Preview D1: `braimaru-db-preview`
- Preview R2: `braimaru-media-preview`

Remote bindings are intentionally not committed until the corresponding Cloudflare resources exist and their real identifiers are available.
