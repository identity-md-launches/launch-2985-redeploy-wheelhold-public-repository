# Wheelhold — A Squeekchain Colony

Static release of [Maje53/wheelhold at `39dff48018271dd54bacae90ae1eb1abaa76a4ef`](https://github.com/Maje53/wheelhold/commit/39dff48018271dd54bacae90ae1eb1abaa76a4ef). This commit is the only source of the exported application. All 14 upstream files carried in `web/`, including application code, CSS, HTML, tests, package manifest and lockfile, retain their exact original bytes. `web/UPSTREAM.json` records their Git blob and SHA-256 hashes.

The handoff contains the earlier Squeek Colony implementation at the root. Its protected package files and build configuration remain unchanged. **The release project is `web/`; install, test and build from that directory.** The root `src/`, `public/`, `index.html` and package scripts are historical inputs, not the source of this export.

## Install, run and rebuild

Use Node.js 22 and npm. Installation needs the npm registry; production fonts and images are included locally.

```sh
cd web
npm ci
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

The build writes **repository-root `dist/`**, the complete static hosting payload. `web/vite.config.js` sets `base: './'` and `outDir: '../dist'`. Preview uses that export. For development, run `npm run dev` from `web/`.

From the repository root, verify upstream integrity with:

```sh
node scripts/verify-upstream.mjs
```

Deployment additions are the Vite configuration, local copies of the original DM Mono and Manrope fonts with their licenses, a share image made from the original habitat illustration, and provenance files. At build time the configuration substitutes the local font stylesheet and sets the document title and share metadata. It does not change game JavaScript, gameplay styles, API requests, wallet behavior or settlement rules. The resulting JavaScript is byte-identical to a clean build of the pinned checkout; its SHA-256 is `8d70d884cc4bd752108d0ba2d64d56643ffd5dabbc653261193b3661ddd8e7d6`.

## Integrity and settlement

Wheelhold reads `https://api.squeekchain.com/v1/status` and `/v1/core`. No backend, private RPC, key, approval or transaction is added by this release. This is a personal, locally persisted colony, not a shared multiplayer game.

The public snapshot inspected on 2026-11-05 reported `settlementQueue.state: "disabled"` and `settlementEnabled: false`. New locks remain disabled. Selecting a move does not settle a round or award resources. The upstream training display remains explicitly labelled and cannot score a live round. No rewards, mock live data or fallback settlement have been added. The original IMD job link remains in the footer.

**Known upstream limitation:** telemetry labels update on render rather than at the instant a reading expires. An expiry-between-refreshes check reproduced a retained `LIVE WHEELY9000` label after expiry, until the next render/refresh. The lock handler independently rechecks freshness. The requested absolute guarantee that stale telemetry is never labelled live is therefore not met by this exact commit. The source is preserved as requested; no patch or settlement bypass has been applied.

## Actual validation

| Check | Result |
| --- | --- |
| `npm ci` in `web/` | Passed; 13 packages installed, audit reported 0 vulnerabilities |
| `npm test` in `web/` | Passed: 14 tests, 0 failures, 0 skipped |
| `npm run build` in `web/` | Passed with Vite 7.3.7; root `dist/` generated |
| Upstream integrity | All 14 retained upstream files match the pinned commit |
| JavaScript syntax | `node --check` passed for all three application modules and the added config |
| Typecheck | TypeScript 5.9.3 `--allowJs --checkJs --noEmit` ran; 9 diagnostics in unchanged upstream code |
| Chromium interactions | Four choices, keyboard selection/focus, persistence/reload, skip link, guest wallet feedback and visible footer link passed |
| Settlement / invalid data | Disabled public snapshot, stale, unverified and unavailable states cannot lock or award resources |
| Responsive layout | 320, 390, 800, 801, 1024 and 1440 CSS pixels; no horizontal page scroll |
| Better Interface / taste@1 | All six domains reviewed; 8/16 probe checks passed; inherited findings documented |
| Phone first screen | Product visible; move/lock controls remain below the fold in the pinned layout |

Typechecking ran against `web/src/api.js`, `game.js` and `main.js` using `tsc --allowJs --checkJs --noEmit --target ES2023 --module ESNext --moduleResolution bundler --skipLibCheck`. See [actual diagnostics](docs/validation/typecheck.txt). Adding annotations or rewriting the source to silence them would change the requested commit.

The production export was served under a subpath. Native Chromium requests to the public API failed with `net::ERR_EMPTY_RESPONSE` in this runtime and correctly displayed training/unavailable feedback. The settlement-disabled browser check used freshly retrieved, unchanged public responses in an isolated test context; negative-state cases used test-only variants. No test data or interception is shipped in `dist/`. WebKit could not launch because its bundled executable was unavailable. Live active/zero-round settlements, physical devices and real wallet connection were not verified.

See [VALIDATION.md](VALIDATION.md), [DESIGN.md](DESIGN.md) and [browser evidence](docs/validation/interaction-results.json) for coverage and limitations.

## Hosting handoff

Existing project URL: [squeek-colony-the-wheel-writes-o.imd.site](https://squeek-colony-the-wheel-writes-o.imd.site). Existing name: `squeek-colony-the-wheel-writes-o.identitymd.eth`. Keep the URL to avoid a risky rename. Root `dist/` is ready for IMD's review and hosting step; the worker must include it with the source and `web/package-lock.json`. No Git staging or commit was performed in this sandbox.

**Publication is pending.** The publishing CLI was unavailable (`imd: command not found`), and no connected hosting tool was provided. A read-only check of the public URL still returned the previous Squeek Colony HTML. Do not describe the new commit as live until hosting updates that URL and `/build-info.json` reports `upstreamCommit: "39dff48018271dd54bacae90ae1eb1abaa76a4ef"` with matching release assets. [Release hashes](docs/validation/release.json) are worker observations, not independent certification.

Original paid IMD job: [10243a89-33c6-4399-a3b2-85890e3ddc68](https://explorer.imd.fun/jobs/10243a89-33c6-4399-a3b2-85890e3ddc68). This continuation: `32b72a7f-e7a9-44af-9473-0216c62f1216`. No Genesis approval is claimed.
