# Assignment checklist

This checklist distinguishes implemented features from checks still needed on the new deployment. It is not a guarantee of a particular grade.

## Main requirements

| Requirement | Current status |
| --- | --- |
| Next.js App Router and Tailwind styling | Implemented |
| Navbar logo, active links, Plan/Saved badges and live counters | Implemented |
| Required hero copy, icon CTA to #library, and banner image | Implemented |
| API library with twelve cards and desktop three-column grid | Verified on the published site: twelve cards and three desktop columns |
| Card images, tags, name, equipment and icon stats | Implemented |
| Dynamic details with image, description, specs and instructions | Implemented; twelve detail routes exported successfully |
| Add to Plan and Save actions with counters and toasts | Implemented |
| My Plan tabs and Exercises/Minutes/Calories totals | Implemented |
| View Details, completion and removal controls | Implemented |
| Loading and required empty-state content | Implemented |
| Footer branding and copyright | Implemented |
| Mobile, tablet and desktop layouts | Mobile and tablet layouts inspected; desktop grid measured; see verification notes |
| Custom 404, loading animation and error recovery | Custom 404 and loading observed; error recovery implemented but not forced in production |
| Direct route reloads after deployment | Detail and My Plan reloads verified on the published site |
| At least eight meaningful commits | Satisfied: at least nine meaningful commits are already published |
| Public deployment without errors | Published successfully; no console errors in the tested browser session |

## Challenge requirements

| Requirement | Current status |
| --- | --- |
| Sort By: Duration, Calories, Rating; default Duration; chevron | Implemented; sorting logic tests pass |
| README with name, description, technologies and at least five features | Documented |
| Mark as Done and Remove with icons and toasts | Implemented; state transition tests pass |

## Optional features

| Requirement | Current status |
| --- | --- |
| Persist plan and saved data in localStorage | Implemented; storage tests pass |
| Search library and My Plan by name or tag | Implemented; search logic tests pass |
| Disable Add when the plan has five workouts | Implemented; limit tests pass |

## Verification and submission

- Published website: https://arafatshuvo07.github.io/fitlog-workout-planner/
- Repository: https://github.com/arafatshuvo07/fitlog-workout-planner
- Home, My Plan, all twelve detail routes, and invalid routes have been checked.
- Add/Save, counters, totals, tabs, sorting, search, Done/Undo, removal, and reload persistence were exercised in the browser.
- API loading, loaded images, and console output were inspected.
- Mobile and tablet layouts were visually inspected; desktop layout was measured. Pixel-perfect parity with the supplied design has not been established.
- The five-workout limit is covered by automated tests; the latest live session did not populate five entries.
- Submission itself remains a user action: submit both links before the applicable deadline.
- Technical checks do not establish compliance with the assignment's independent-work policy or guarantee a score.

See [verification.md](verification.md) for evidence, the build-time API timeout, and test limitations.
