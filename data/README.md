# Workout snapshot

`workouts.json` contains the twelve original API records recovered from the successful local static export on 26 September 2026. They were serialized as props for WorkoutActions in `out/workouts/[id]/index.txt`. No exercise fields were invented.

Source: https://api.abcz.workers.dev/api/fitlog

The live API is always attempted first. This snapshot is used only when that request fails or returns an invalid/empty catalog. The UI identifies saved data. To refresh the snapshot, validate a successful API response against workoutSchema and replace this file. Details require a rebuild to update on static hosting.
