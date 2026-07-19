# VietTools

VietTools is a free, privacy-first collection of browser-based utilities designed for Vietnamese users. Sprint 1 delivers a production-ready Vietnamese number-to-words converter.

## Features

- Vietnamese integer-to-words conversion, including negative and very large values
- Vietnamese currency and capitalization modes
- Thousand separators using dots, commas, or spaces
- Responsive, keyboard-accessible interface
- Static SEO content, JSON-LD, sitemap, robots rules, and legal pages
- Client-side processing: tool input is never sent to a server

## Tech stack

Next.js App Router, React, TypeScript strict mode, Tailwind CSS, pnpm workspaces, Turborepo, Vitest, React Testing Library, ESLint, and Prettier. The project is ready for Playwright scenarios when browser-level coverage is added.

## Repository structure

```text
apps/web                       Next.js application
packages/ui                    Shared UI primitives
packages/vietnamese-utils      Pure Vietnamese-language utilities and tests
packages/text-utils            Phase 3 package placeholder
packages/config                Shared TypeScript and formatting configuration
```

## Local development

Prerequisites: Node.js 22+ and pnpm 10+.

```bash
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `apps/web/.env.local`. `NEXT_PUBLIC_SITE_URL` is used as the single source for canonical URLs, sitemap, robots, and JSON-LD. Contact and GitHub values have safe development fallbacks. Analytics and AdSense remain disabled when their IDs are blank.

## Available scripts

- `pnpm dev` — start workspace development tasks
- `pnpm build` — build all packages and the web application
- `pnpm lint` — lint all workspaces
- `pnpm typecheck` — run TypeScript checks
- `pnpm test` — run unit and component tests
- `pnpm test:coverage` — run tests with coverage thresholds
- `pnpm format` / `pnpm format:check` — write or check formatting

## Testing

The number converter is covered by Vitest cases for digits, tens, hundreds, missing hundreds, grouped input, negative values, options, invalid input, and large values. React Testing Library covers conversion, clearing, examples, and accessible errors.

```bash
pnpm test
pnpm test:coverage
```

## Deployment

Import the repository into Vercel, select `apps/web` only if Vercel does not auto-detect the Turborepo, and configure the variables from `.env.example`. The standard build command is `pnpm build`. Deployment itself is intentionally not automated from CI because it requires project credentials and domain ownership.

## Privacy principles

User-entered values are converted locally in the browser. They are not persisted, included in URLs, logged, or attached to analytics events. The analytics abstraction accepts only a tool identifier. No authentication, database, or separate backend is used.

## Technical decisions

- Integer input is processed as strings to prevent JavaScript number precision loss.
- Decimal input is deferred to a later phase; ambiguous decimal/thousand formats are rejected.
- The converter accepts up to 66 digits, a clear product guardrail that still exceeds common usage.
- Pages remain Server Components; only navigation and converter interactions opt into client JavaScript.
- Ad placeholders appear only in development. Production renders no ad without a future integration.

## Roadmap

- Phase 2: Vietnamese diacritic removal, slug generation, word counting, and case conversion
- Phase 3: list sorting/deduplication, text diff, whitespace normalization, and multi-value replacement

## License

[MIT](LICENSE)
