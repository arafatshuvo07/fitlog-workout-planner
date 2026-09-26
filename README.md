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
- My Plan, custom error pages, and deployment are still pending. The app is not ready for submission.
