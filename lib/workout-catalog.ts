import snapshot from "../data/workouts.json";
import { fetchWorkout, fetchWorkouts, workoutSchema } from "./workouts";

const savedCatalog = workoutSchema.array().min(1).parse(snapshot);

// Keep the last successful API data available during upstream outages.
export async function loadCatalog(signal?: AbortSignal) {
  signal?.throwIfAborted();
  try {
    const workouts = await fetchWorkouts(signal);
    if (!workouts.length) throw new Error("The API returned an empty library.");
    signal?.throwIfAborted();
    return { workouts, source: "live" as const };
  } catch {
    signal?.throwIfAborted();
    return {
      workouts: structuredClone(savedCatalog),
      source: "saved" as const,
    };
  }
}

export async function loadWorkout(id: string) {
  if (!/^[1-9]\d*$/.test(id)) return null;
  try {
    const workout = await fetchWorkout(id);
    return workout ? { workout, source: "live" as const } : null;
  } catch {
    const workout = savedCatalog.find((item) => String(item.id) === id);
    return workout
      ? { workout: structuredClone(workout), source: "saved" as const }
      : null;
  }
}
