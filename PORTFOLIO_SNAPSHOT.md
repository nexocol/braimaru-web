# BRAIMARÚ — Portfolio Snapshot V2

This branch is a frozen portfolio copy of the BRAIMARÚ storefront approved by the client on 2026-10-01.

## Purpose

- Preserve the approved public-facing design exactly as a showcase/reference.
- Keep the storefront independent from future client Admin changes.
- Avoid dependence on Production D1 content, Admin credentials, or future catalog edits.
- Preserve the source code and assets for future portfolio/reference use.

## Frozen behavior

The public storefront reads from `src/data/products.ts` only. It does **not** fetch:

- `/api/products`
- `/api/categories`
- `/api/site`

The Worker/API/Admin code remains in the repository for historical/source reference, but the public showcase does not depend on it.

## Source baseline

Production-approved source commit:

`7f263572bf76a406a347dc94b80a253f7766db08`

Portfolio branch:

`feat/portfolio-v2-approved`

Do not merge this branch back into `main`. It exists only as a stable portfolio/archive snapshot.
