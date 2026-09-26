# FitLog — Workout Library & Planner

FitLog is a Next.js workout library for choosing exercises, building a daily plan, and saving lifts for later. It uses the API and design resources supplied with Programming Hero B14 Assignment 6.

## Project links

- [GitHub repository](https://github.com/arafatshuvo07/fitlog-workout-planner)
- [GitHub Pages website](https://arafatshuvo07.github.io/fitlog-workout-planner/)

## Features

1. Browse twelve API workouts with images, muscle tags, equipment, and workout stats.
2. Open a detail page with the exercise description, specs, and numbered instructions.
3. Add workouts to Today's Plan or Saved, with shared navbar counters and toast feedback.
4. Track exercise count, total minutes, and calories on My Plan.
5. Mark workouts done, undo completion, or remove workouts from either list.
6. Search by workout name or muscle group and sort by duration, calories, or rating.
7. Keep plan, saved, and completion state in localStorage across reloads.
8. Prevent duplicates and limit Today's Plan to five workouts.
9. Handle loading, empty lists, failed requests, and missing pages.
10. Use responsive layouts, keyboard-accessible controls, locally bundled fonts, and image fallbacks.

## Technologies

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4 and shared CSS styles
- React Context API for shared state
- Sonner notifications and Lucide icons
- Zod for API and stored-data validation
- Inter and Oswald fonts from Fontsource
- Node.js test runner with tsx

## Local setup

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed in the terminal. No API key, database, or account is required.

```sh
npm test
npm run typecheck
npm run build
npm start
```

The production build writes to `out/`; `npm start` serves that directory. On this machine, the normal build encountered API connection timeouts. The following command completed successfully:

```sh
NODE_OPTIONS=--dns-result-order=ipv4first npm run build
```

See [verification notes](docs/verification.md) for the actual results and remaining checks.

## Routes and API

| Route | Content |
| --- | --- |
| `/` | Hero and workout library |
| `/workouts/[id]/` | Workout details and Add/Save actions |
| `/my-plan/` | Plan and Saved tabs, totals, completion, and removal |
| Unknown routes | Custom 404 page |

API endpoints:

- All workouts: `https://api.abcz.workers.dev/api/fitlog`
- One workout: `https://api.abcz.workers.dev/api/fitlog/:id`

Home and My Plan fetch fresh data in the browser. Detail pages fetch data during the static build. Rebuild and redeploy when the API adds workouts or changes their details.

## Plan behavior

- Totals include all workouts in Today's Plan, including completed ones. Search and sorting do not change totals.
- Saved workouts are separate and do not contribute to plan totals.
- The five-workout limit includes completed workouts. Remove one to free a slot.
- Duration and calories sort ascending; rating sorts descending. Duration is the default.
- State belongs to the current browser. It does not sync across devices or reset automatically at midnight.
- A failed refresh leaves stored workouts available. Invalid stored data is handled without crashing.

## Project structure

```text
app/                    Routes, layout, loading, and error pages
components/             Library, plan view, navigation, and shared controls
context/plan-context.tsx Shared state, persistence, and toasts
lib/                    API helpers, validation, sorting, and plan transitions
public/                 Assignment logo and banner
tests/                  State and API tests
docs/                   Requirements and verification notes
```

## Deployment

The GitHub Actions workflow runs tests, checks types, builds the static export, and deploys pushes to `main`. GitHub Pages must use GitHub Actions as its source. The workflow sets the repository base path and IPv4-first DNS ordering.

[Deployment runs](https://github.com/arafatshuvo07/fitlog-workout-planner/actions) show whether the latest publish succeeded. Local verification results are in [verification notes](docs/verification.md); the workflow result alone does not verify browser interactions.

For domain-root static hosting, leave `NEXT_PUBLIC_BASE_PATH` empty, build the project, and publish `out/`. For this repository's GitHub Pages deployment, build with `NEXT_PUBLIC_BASE_PATH=/fitlog-workout-planner`. Configure the host to serve directory index files and the generated `404.html` so detail-page reloads work.

Home, all twelve Details URLs, My Plan, direct detail/plan reloads, mobile/tablet layouts, API loading, and the browser console were checked on the published site. See [verification notes](docs/verification.md) for the scope and limitations. Submit the live and repository links before the applicable assignment deadline.

## Requirements and sources

- [Requirement checklist](docs/requirements-checklist.md)
- [Original assignment brief](docs/assignment-reference.md)
- [Assignment repository and design resources](https://github.com/ProgrammingHero1/B14-A6-Fit-Log)

The implementation was copied in stages from the earlier FitLog project. The error recovery button was updated to use the installed Next.js version's `retry` API. Logo, banner, and design references come from the assignment; workout text and image URLs come from its API.
