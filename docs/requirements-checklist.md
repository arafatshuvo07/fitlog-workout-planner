# Assignment checklist

This checklist distinguishes implemented features from checks still needed on the new deployment. It is not a guarantee of a particular grade.

## Main requirements

| Requirement | Current status |
| --- | --- |
| Next.js App Router and Tailwind styling | Implemented |
| Navbar logo, active links, Plan/Saved badges and live counters | Implemented |
| Required hero copy, icon CTA to #library, and banner image | Implemented |
| API library with twelve cards and desktop three-column grid | Implemented; live rendering check pending |
| Card images, tags, name, equipment and icon stats | Implemented |
| Dynamic details with image, description, specs and instructions | Implemented; twelve detail routes exported successfully |
| Add to Plan and Save actions with counters and toasts | Implemented |
| My Plan tabs and Exercises/Minutes/Calories totals | Implemented |
| View Details, completion and removal controls | Implemented |
| Loading and required empty-state content | Implemented |
| Footer branding and copyright | Implemented |
| Mobile, tablet and desktop layouts | Styles implemented; new deployment checks pending |
| Custom 404, loading animation and error recovery | Implemented; live checks pending |
| Direct route reloads after deployment | Pending deployment |
| At least eight meaningful commits | This documentation change is the eighth commit once committed |
| Public deployment without errors | Pending deployment and verification |

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

## Checks still needed

- Publish the new repository and record the real live URL.
- Check Home, all twelve Details routes, My Plan, and invalid routes.
- Reload detail and plan routes directly on the published site.
- Check Add/Save, counters, totals, both tabs, sorting, search, Done/Undo, removal, and persistence in the browser.
- Inspect mobile/tablet/desktop layouts and compare them with the supplied design. Pixel-perfect parity has not been established.
- Check API and image loading and browser console errors.
- Submit both the new repository URL and verified live URL within the applicable deadline.

Local results and the API timeout encountered during the build are recorded in [verification.md](verification.md).
