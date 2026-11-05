# Wheelhold design reference

## Overview

Wheelhold — A Squeekchain Colony is a personal colony strategy game. The pinned implementation pairs a dark, gridded landscape with a lime accent, a heavy outlined slogan, a CSS-drawn hamster habitat, and dense monospace game panels. It is preserved from upstream commit `39dff48018271dd54bacae90ae1eb1abaa76a4ef`; this release does not redesign it.

The active source is `web/src/main.js` and `web/src/style.css`, not the historical root application. Rendering uses template strings and event bindings rather than a component framework. Reuse the existing patterns below; do not infer that the inherited design passes every Better Interface threshold. Review findings are in `VALIDATION.md`.

## Colors

All tokens are declared in `web/src/style.css:2`, using hex values.

| Token | Value | Implemented role |
| --- | --- | --- |
| `--bg` | `#0d1410` | Page background beneath the grid and radial wash |
| `--ink` | `#edf2e7` | Primary text |
| `--muted` | `#8d9990` | Labels and secondary content |
| `--line` | `#2b3730` | Panel boundaries and separators |
| `--card` | `#151e19` | Colony, actions and chronicle panels |
| `--card2` | `#1a241e` | Action choice surfaces |
| `--lime` | `#b8f36b` | Brand, primary action, selection and keyboard focus |
| `--blue` | `#74a7ff` | Existing declared token; not the meter's literal blue |

The warning notice uses `#3c2b1e`; the ordinary notice uses `#29301d` with `#d7e3b5` text. Selected actions use `#1c2a20`. Disabled commit uses `#2b352e` and `#68736b`. Meter tones are literal `#f4d35e` (morale), `#48c9a5` (defense), `#66a8ff` (mapped) and `#ef6a6a` (boss). The habitat uses its own illustration palette. There is one dark theme; no light-mode switch is implemented.

The probe measured action-risk labels at 3.20:1 on their solid surface, proof text at 3.28:1 and the empty chronicle at 3.33:1; these inherited failures remain. The disabled commit's 2.58:1 is reported separately because inactive controls are contrast-exempt. Text over gradients/illustration was not assigned an invented contrast ratio.

## Typography

The original families and requested weights are retained. `web/hosting/fonts.css` packages the Google Fonts faces as local WOFF2 files; `web/vite.config.js` substitutes this stylesheet at build time without changing upstream CSS. Fonts ship with SIL Open Font Licenses in `web/public/licenses/` and `dist/licenses/`.

| Role | Actual source styling |
| --- | --- |
| Body / descriptions | `Manrope, Arial, sans-serif`; hero description 16px / 1.7, maximum width 650px |
| Main slogan | Manrope 800, `clamp(48px, 7.5vw, 94px)`, line-height .88, tracking -.065em; second line transparent with a 1px `#708078` stroke |
| Mobile slogan | At 800px and below, `clamp(40px, 10.8vw, 46px)` and -.055em tracking |
| Panel headings | DM Mono 600, 13px, .08em tracking |
| Action labels / copy | DM Mono 600 at 12px; descriptions 11px with 1.4 line-height |
| Labels | DM Mono 500, 9px, .12em tracking |
| Telemetry numbers | DM Mono 500, 19px; resources 20px |
| Status / notice / footer | Mostly DM Mono 9–10px, with existing tracked uppercase text |

Manrope font faces include 400, 600, 700 and 800; DM Mono faces include 400 and 500. Upstream requests some additional DM Mono weights, which can be synthesized by the browser. Do not describe those as separately supplied font files. Local DM Mono 400/500 and Manrope 400/800 were observed loaded in Chromium. The probe found eight sizes used repeatedly and six computed weights; a six-step scale has not been imposed on the pinned source.

## Layout

`main` has a maximum width of 1220px, centered with 62px vertical and 24px horizontal padding. The hero's maximum width is 850px, with 44px below it. The world card follows, then an 18px gap to the dashboard. The dashboard has `.82fr 1.18fr` columns and an 18px gap. Panels use 28px padding; action choices form a two-column grid with 10px gaps and at least 110px height. The footer wraps with an 18px gap.

The single breakpoint is `max-width: 800px`: header inset becomes 16px; the season is hidden; wallet control becomes a 42×38px icon button retaining its accessible name; main padding becomes 42px 14px; panels use 20px padding; dashboard and action grids each become one column; telemetry becomes two columns; habitat height changes from 340px to 270px; the wheel and burrow are scaled. The secondary footer slogan is hidden, while the IMD link remains.

The source sets `overflow-x: hidden` on `html, body`, and clips decorative habitat layers. The probe also checks text clipping rather than relying solely on page scroll width. Chromium was checked at 320, 390, 800, 801, 1024 and 1440px. No horizontal page scroll was observed. At 390×844 the first action begins around y=1419 and the commit control around y=1910 in the recorded unavailable state: neither is on the first screen. This is the unchanged upstream arrangement, not a fulfilled first-screen criterion. Native 200% zoom, physical devices and RTL were not checked.

## Elevation & Depth

Panels use 1px structural borders and tonal fills. The main illustration has a moon inset shadow, layered hills, a wheel ring and wheel drop shadow. That border-plus-shadow wheel is game artwork, not an elevated application card. Selected and hovered action buttons get a lime border and darker green fill. Toast feedback is a fixed lime surface at z-index 10; the skip link uses z-index 20.

## Shapes

Application surfaces and buttons are rectangular. The small WH brand badge uses a six-sided clip path. The habitat uses circular wheel/moon shapes, a clipped burrow, and rounded hamster parts. Progress bars are native `<progress>` elements styled to 4px height; meter fills have per-tone browser-specific rules. These are existing patterns, not a generalized radius system.

## Components

| Pattern / source | States and behavior |
| --- | --- |
| `render()` in `web/src/main.js:39` | Produces header, status, habitat, telemetry, panels, chronicle and footer; restores focused element after rerender |
| `.brand`, `.wallet` | Wheelhold home link; optional public-account wallet request; guest feedback if no provider is installed |
| `hamster()` in `web/src/main.js:29` | Decorative landscape; animation only requested for fresh trusted active telemetry |
| `.telemetry`, `.notice` | Distinct live, stale, untrusted, training, connecting and settlement-paused wording; status also appears as text |
| `meter()` in `web/src/main.js:96` | Accessible labelled progress meters, fixed state-derived colors |
| `.action`, `.selected` | Native buttons with `aria-pressed`; Forage, Fortify, Explore and Raid; focus stays on the selected choice after rerender |
| `#commit`, `.commit:disabled` | Full-width lock control; native disabled state while settlement is blocked or a round is pending; handler independently checks eligibility |
| `.chronicle` | Empty message or locally persisted verified-result rows; existing transaction proof links |
| `toast()` in `web/src/main.js:124` | Polite `role=status` feedback; replaces prior message and hides after 3.5 seconds |
| `.skip`, `:focus-visible` | Visible-on-focus skip link and 2px lime focus outline with 3px offset |

The wheel's keyframe rotation is constrained by the upstream reduced-motion query, which reduces animation duration and iterations. The toast still declares a .25s transition. No motion library, modal, form or new wallet connector is added. Live successful lock/settlement and a real wallet account were not exercised because settlement was disabled and no wallet was available.

## Do's and Don'ts

- Preserve the exact application source for this release; run `node scripts/verify-upstream.mjs` after packaging changes.
- Build from `web/` and publish the complete root `dist/` with its relative URLs, fonts, share image, licenses and provenance.
- Keep state wording tied to the original verification, freshness and settlement checks. Keep the paid IMD job link in the footer.
- For a future authorized page, start with the existing centered `main`, panel and native button patterns, referencing the same color tokens and font assets. Do not invent a new typography or card system.
- Do not synthesize rewards, change API identities, bypass settlement pause or describe browser-local progress as shared multiplayer state.

Review methodology used the pinned IMD Better Interface guide: Jakub Krehel's Better Interface (MIT), with documentation guidance adapted from Paul Bakaus's Impeccable (Apache-2.0). This document describes the implemented source and measured limits, not design approval or Genesis approval.
