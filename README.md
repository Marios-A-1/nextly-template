# Art of the Possible

Greek website for the plastic surgery clinic of Dr. Petros Th. Vlastarakos. It uses the Melina layout and animations with the clinic’s production content.

## Local development

Use Node.js 20.9 or later and pnpm 9.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The dev server listens on port 3001. Run `pnpm test`, `pnpm lint`, and `pnpm build` before deploying. With the production build running on port 3270, run `node scripts/smoke.mjs` to check the public URLs and gallery.

The appointment form forwards requests through the existing webhook. Configure `LEADS_API_URL` and, if required by that webhook, `LEADS_API_KEY` as server-side environment variables. Use a mock webhook for local testing. The existing Vercel project supplies the Preview and Production settings.

The treatment catalog is in `src/content/epemvaseis.js`. The gallery reads image files from `public/img/results`.
