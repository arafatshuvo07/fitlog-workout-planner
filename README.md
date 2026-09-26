# FitLog

A workout library and daily workout planner built with Next.js.

## Setup

```sh
npm ci
```

This first commit contains the project configuration copied from the existing FitLog project. Application pages and features are being brought over in subsequent steps.

## Current progress

- Project configuration and dependencies are in place.
- Shared layout, navigation, footer, fonts, and responsive styles have been copied from the existing project.
- The shared plan state and workout helpers are included because the navigation uses the plan and saved counters.
- Home now includes the hero, API workout cards, search, sorting, loading indicators, and a retry option for failed requests.
- Dynamic workout details include the image, muscle groups, equipment, workout numbers, and step-by-step instructions. Detail routes fetch API data during the static build.
- Detail actions connect to the shared plan and saved state, with duplicate protection, toasts, and the five-workout plan limit.
- My Plan includes Today's Plan and Saved tabs, exercise/minute/calorie totals, search, sorting, completion toggles, and removal actions.
- Empty lists, loading, API refresh failures, and the five-workout limit are handled in the plan view.
- Custom 404 and error recovery pages include links back to the library. The error recovery button uses Next.js retry to re-fetch and render the failed route.
- The 12 automated tests and TypeScript check pass. Production export passes with IPv4-first DNS ordering on this machine; see docs/verification.md for details.
- Final documentation, deployment, and live browser checks are still pending. The app is not ready for submission.
