# Project Library

A minimal, library-style portfolio for exploring software projects as living
notes rather than product landing pages.

Each project entry can include a brief, core functions, technologies,
screenshots with individual captions, source and demo links, and optional
question-and-answer notes.

## Features

- Searchable and filterable project index
- Compact, information-first project pages
- Responsive light and dark themes
- Password-protected owner editor
- Manual project creation and editing
- Multiple screenshot uploads with captions and image descriptions
- JSON export and import for backups and environment migration
- Cloudflare D1 project storage and R2 screenshot storage

## Technology

- Next.js-compatible routing through [vinext](https://github.com/cloudflare/vinext)
- React and TypeScript
- Cloudflare D1
- Cloudflare R2
- CSS with responsive layouts and persistent theme preference

## Local development

Requirements:

- Node.js 22.13 or newer
- npm

Install and start:

```bash
npm install
npm run dev
```

The local site is available at `http://localhost:3000`.

## Admin configuration

Create a local `.dev.vars` file:

```dotenv
ADMIN_PASSWORD_HASH=<sha256-password-hash>
ADMIN_SESSION_SECRET=<long-random-secret>
```

The raw admin password is never stored in source control. `.dev.vars` and other
environment files are ignored by Git.

The editor is available at `/admin`.

## Storage

- Repository-backed starter entries live in `app/data/projects.ts`.
- Projects created or changed through the editor are stored in D1 and override
  matching repository-backed entries by URL slug.
- Uploaded screenshots are stored in R2.
- Exported JSON contains project records and screenshot references, but not the
  image binaries.

For local development, the Cloudflare bindings are simulated by the Vite
configuration.

## Verification

```bash
npm test
npm run lint
```

`npm test` creates a production build and runs the project contract tests.

## Deployment

The repository is configured for OpenAI Sites through
`.openai/hosting.json`, with:

- `DB` as the D1 binding
- `MEDIA` as the R2 binding

Set `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` in the production
environment before using the owner editor.

When moving existing local project records to production:

1. Save every local edit.
2. Export a JSON backup from the local owner editor.
3. Deploy the application.
4. Sign in to the production owner editor.
5. Import the JSON backup.
6. Upload screenshots directly in production.
