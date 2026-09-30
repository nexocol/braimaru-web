# BRAIMARÚ Admin authentication

The Admin uses one username/password account and a signed HttpOnly cookie.

## Runtime secrets

These values must be configured as Cloudflare Worker secrets and must never be committed:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`

The session cookie is:

- HttpOnly
- Secure
- SameSite=Strict
- Path=/
- 8 hour lifetime

No token is stored in localStorage.

## Generate ADMIN_PASSWORD_HASH

The repository includes a local helper that outputs a PBKDF2-SHA256 hash with:

- random 16-byte salt;
- 100,000 iterations;
- 32-byte digest.

The 100,000-iteration value matches the current PBKDF2 iteration limit enforced by the Cloudflare Workers runtime. The Worker rejects hashes configured with a higher iteration count before invoking Web Crypto.

macOS/Linux:

```bash
ADMIN_PASSWORD='your-real-password' node scripts/hash-admin-password.mjs
```

PowerShell:

```powershell
$env:ADMIN_PASSWORD='your-real-password'
node scripts/hash-admin-password.mjs
Remove-Item Env:ADMIN_PASSWORD
```

Copy only the resulting hash into the Cloudflare secret. Do not store the plaintext password in a file or commit it.

Hash format:

```text
pbkdf2-sha256$100000$<salt-base64url>$<digest-base64url>
```

## Preview secrets

Cloudflare Worker Previews keep their own secrets. Configure the three values for the `feat/v1-data-admin` Preview before remote authentication testing.

Production secrets are intentionally not configured in this phase.
