# Wheelhold release validation

Worker observations on 2026-11-05. These checks are not independent certification. **Completion: useful static release prepared; live publication and full acceptance remain incomplete.** The exact pinned upstream source is retained despite the inherited findings below.

## Scope and source

The release source is `web/`, imported from [Maje53/wheelhold commit 39dff48018271dd54bacae90ae1eb1abaa76a4ef](https://github.com/Maje53/wheelhold/commit/39dff48018271dd54bacae90ae1eb1abaa76a4ef). GitHub's commit response identified tree `4efc9496b012ada8466ca9ae3a8e253257ab56de`. Archive bytes were checked against GitHub's recursive blob listing. Fourteen retained upstream files match both their Git blob hashes and recorded SHA-256 values. The upstream `.gitignore` was omitted so the unchanged workspace ignore rules apply; no ignore file was changed.

The original root project and its protected package/build files remain untouched. `web/vite.config.js` is a new configuration for the isolated release. It adds relative URLs, export to root `dist/`, local packaging of the same fonts, and title/share metadata. It makes no JavaScript or gameplay styling changes. A second, pristine upstream build using its own `npm ci` produced byte-identical JavaScript: SHA-256 `8d70d884cc4bd752108d0ba2d64d56643ffd5dabbc653261193b3661ddd8e7d6`. Different output filenames result from the build's dependency graph; the actual JavaScript bytes are identical.

No contracts, rewards, settlement results, new game logic or wallet connectors were added. Runtime API targets remain the original public endpoints. The footer retains the original paid IMD job reference. `dist/build-info.json` states the upstream source commit; it is not a deployment receipt.

## Commands and results

| Command / action | Actual result |
| --- | --- |
| `npm ci` in `web/` | Exit 0; 13 packages installed; npm audit reported 0 vulnerabilities |
| `npm test` in `web/` | Exit 0; 14 tests passed, none failed/skipped |
| `npm run build` in `web/` | Exit 0; Vite 7.3.7 compiled six modules and generated root `dist/` |
| `node scripts/verify-upstream.mjs` | Exit 0; 14 pinned files verified |
| `node --check` for `web/src/api.js`, `game.js`, `main.js`, `web/vite.config.js` | All exit 0 |
| TypeScript 5.9.3 JavaScript checking | Exit 2; nine typing diagnostics in unchanged upstream code |
| Chromium interaction harness | Exit 0 for the exercised interactions; explicitly recorded expiry-label failure separately |
| Final taste@1 probe | Exit 0 as a measurement run; 8/16 checks passed, eight reported failures |
| `git diff --exit-code` on protected root package/configuration paths | Exit 0; no modifications |
| `imd site --help` | Exit 127, `imd: command not found`; no publication occurred |

Typecheck command: `node test/scratch/typecheck/node_modules/typescript/bin/tsc --allowJs --checkJs --noEmit --target ES2023 --module ESNext --moduleResolution bundler --skipLibCheck web/src/api.js web/src/game.js web/src/main.js`. TypeScript was installed only in temporary validation scaffolding. Diagnostics are retained in `docs/validation/typecheck.txt`; the build does not require TypeScript or that scaffolding.

The prescribed final probe ran before the final build:

```sh
IMD_PLAYWRIGHT=/opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste
```

Its report is preserved in `docs/validation/taste.json`. The browser MCP connector returned `Transport closed`; a bounded foreground Node script used the provided Playwright Chromium runtime and served the finished export under `/preview/`. The script closed its server and browser on completion. No background preview process is required by the deliverable.

## Functional observations

- Pointer selection worked for Forage, Fortify, Explore and Raid. Forage also worked by keyboard Space; `aria-pressed` updated and the visible focus ring survived rerender. Selection persisted across reload.
- The skip link navigated to `#game`. The guest wallet control produced its existing “No wallet detected” feedback. No wallet account, chain switch, signature or transaction was fabricated.
- The IMD footer link was scrolled into view and its exact URL checked: `https://explorer.imd.fun/jobs/10243a89-33c6-4399-a3b2-85890e3ddc68`.
- Chromium rendered at 320, 390, 800, 801, 1024 and 1440 CSS pixels without horizontal page scroll. The probe additionally reported no text overlaps, covered text or clipped text at 320, 390 and 1440. Screenshots at phone and desktop widths were inspected.
- Title, description, favicon, `og:title` and `og:image` are present. The 1200×630 PNG share card reuses the original habitat artwork, with product text and no telemetry. Local fonts loaded as DM Mono and Manrope; the exported stylesheet has no external font import.
- The public API returned `settlementQueue.state = "disabled"`, `settlementEnabled = false`, `incidentOpen = false` and an unpaused core. The browser test snapshot was retrieved at `2026-11-05T02:26:27.716Z`; its measurement was observed at `2026-11-05T02:26:06.215Z`.
- Native Chromium fetches to the public API failed with `net::ERR_EMPTY_RESPONSE` in this runtime. The application correctly entered its original labelled training/unavailable state; no resource changes or live settlement resulted. Direct public retrieval with curl succeeded. This is not a claim of working browser-to-API connectivity on the final live host.
- An isolated browser context replayed those freshly retrieved public responses unchanged. All four selections left the commit button disabled and labelled `SETTLEMENT PAUSED`. Dispatching directly to its handler also produced no pending round, chronicle entry or resource award. This demonstrates both the disabled UI and eligibility guard with `settlementEnabled: false`.
- Negative browser cases changed only measurement age/provenance or availability within test scaffolding. Stale hardware showed `STALE SIGNAL` / `LAST VERIFIED SPEED`, and unverified provenance showed `NOT LIVE` / `UNVERIFIED`. The wheel did not animate in either state. Stale, untrusted and unavailable data could not create a lock or award resources. No interception, captured API payload or fixture is shipped in the export.
- The upstream unit suite checks confirmed `RoundRecorded` extraction, zero-work evidence completeness, bounded outcomes, identity/chain compatibility, duplicate-round prevention and retry handling. No public successful active or zero-work round was forced while settlement is disabled.

Raw observations: `docs/validation/interaction-results.json`. Screenshots: `docs/validation/screenshots/390.png`, `1440.png`, `keyboard-focus.png`, `settlement-paused-390.png`. These are Chromium emulation, not physical-device or screen-reader evidence.

## Better Interface coverage

The pinned guide's workflow, core principles of all six domains, documentation guidance and design-critic thresholds were read. The task's explicit constraint — “Do not redesign, rename, rewrite or modify the game logic” and treat the pinned commit as the sole source of truth — takes priority over generic style remediation. Packaging defects were corrected; existing design/code findings are disclosed rather than silently changing the requested release.

| Domain | Coverage | Remaining limits |
| --- | --- | --- |
| Accessibility | Checked native controls, accessible names/states, keyboard choice, skip link, visible focus and reduced-motion state | No screen-reader session, physical devices, forced-colors or native 200% zoom; contrast failures below |
| Layout | Checked six widths and both sides of the 800px breakpoint; inspected screenshots and control positions | Main action below phone fold; RTL and translated strings not checked |
| Writing | Checked labels, empty state, training, stale, untrusted, settlement pause and guest feedback against behavior | Exact original uppercase/tracked voice retained; no source copy rewrite |
| Typography | Checked declared roles, actual font assets/loading and computed sizes/weights | Eight repeated sizes and synthesized DM Mono weights remain; text-enlargement not checked |
| Colors | Checked actual tokens and probe-measured solid-background text pairs | Failing pairs remain; 22 text boxes on gradients/illustration were not assigned contrast ratios |
| UI | Checked pointer/keyboard selection, disabled commit, persistence, guest feedback, focus and static/reduced-motion states | Real wallet, enabled live lock/settlement, full Safari and 10%-speed animation replay not reviewed |

The visual idea is the original dark colony landscape and hamster wheel, with lime decisions and monospace operational panels. No competing visual system was added.

## Findings, fixes and disposition

| Finding | Source / evidence | Disposition |
| --- | --- | --- |
| Static export needs relative URLs | Upstream default build uses root-based asset URLs | Fixed by new `web/vite.config.js:10`; final export references local relative assets |
| Missing share image / requested full document title | Upstream `web/index.html:14` has the old tagline title and no `og:image` | Fixed at build time by `web/vite.config.js:23`; actual PNG added, share probe passes |
| Fonts depended on external Google hosts | `web/src/style.css:1` | Fixed during packaging with the same fonts in `web/hosting/`; local fonts were observed loaded |
| High: stale label can remain live between refreshes | `web/src/main.js:44`, `:126`, `:160`; the render computes freshness, but the next scheduled refresh is 15 seconds later | Unchanged upstream limitation; exact-source constraint prevents a runtime patch; absolute stale/live guarantee not met |
| High: primary action below first phone screen | `web/src/main.js:55`, `:70`, `:79`; `web/src/style.css:2`, `:7`; 390×844 screenshot has first action y≈1419, commit y≈1910 | Preserved pinned layout; first-screen criterion not met |
| Medium: supporting text contrast | `web/src/style.css:2`, `.action small`, `.proof`, `.empty`; measured 3.20:1, 3.28:1, 3.33:1 versus required 4.5:1 | Retained under no-redesign constraint; disabled commit's separate 2.58:1 is contrast-exempt |
| Inherited style checks | `web/src/style.css:2`, `web/src/main.js:56`, `:68`; casing, tracking, eyebrow, type-size, type-face and glyph probe failures | Original visual identity/copy retained; counts and selectors in probe report |
| Probe artwork false positive | `web/src/style.css:2`, `.wheel`; border and shadow flag | Illustration ring and shadow are original game art, not a panel defect |
| Typecheck diagnostics | `web/src/api.js:4`, `:13`; `web/src/main.js:40`, `:99`, `:100`, `:113`, `:114`, `:116` | Nine upstream JavaScript typing diagnostics retained; no claim of clean typechecking |

Expiry reproduction uses the unchanged public snapshot, an isolated browser clock set to one second before `observedAt + staleAfterSeconds`, then advances two seconds without forcing a render. Before and after expiry the UI reads `LIVE WHEELY9000`. `telemetryPresentation()` would classify it stale if called again, and `canLockRound()` rechecks time, but the displayed label has not yet rerendered. This is distinct from the passing stale-at-render test and is why the report does not claim “never stale as live.”

Probe passes: render, layout, targets, slogans, repetition, copy-budget, motion, share. Probe failures: contrast, casing, tracking, eyebrows, type-sizes, type-faces, glyphs, chrome. The pass count is not a design approval. Four targets are below the guide's comfortable 44px size but pass its 24px/spacing check. The motion probe observed the static unavailable state; it does not establish every possible toast/wheel animation state.

## Publication and remaining acceptance

The existing URL is [squeek-colony-the-wheel-writes-o.imd.site](https://squeek-colony-the-wheel-writes-o.imd.site). It returned the previous Squeek Colony HTML during this run. The CLI answered `imd: command not found`; no connected publishing tool or slug-changing capability was available. The existing name is retained. The worker's root `dist/` export is the concrete handoff for the normal IMD review/hosting stage, not proof that publication has occurred.

Publication and post-publish commit/asset verification remain pending. Verify the exact `upstreamCommit` in the hosted `build-info.json` and match the release asset hashes after hosting changes the site. WebKit launch was unavailable; real Safari, mobile hardware, wallet account connection and live active/zero-work settlement checks remain unperformed. Genesis approval is neither inferred nor claimed.

## Final packaging check

The final export contains 17 files totalling 303,153 bytes. Every HTML and CSS runtime reference resolves to a bundled relative asset; the share PNG is 1200×630; public provenance matches the pinned commit. Exported JavaScript and all CSS after the font declarations match a pristine build. The prospective complete Git tree was 73 files and 1,420,591 bytes at measurement, including source, required fonts, lockfile, documentation and browser evidence; it is below the 8,388,608-byte cap. No dependency/cache directory or archive is eligible for submission. Root package/lockfile/configuration and all ignore files are unchanged; `git diff --check` passed. Required export and source files are eligible for the worker’s plain `git add -A`. `git check-ignore` returned no matches for the export and pinned package files (exit 1 is its expected no-match result). No staging, commit or `.git/` change was performed by this worker session.
