import { z } from "zod";

export const API_URL = "https://api.abcz.workers.dev/api/fitlog";
export const workoutSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  image: z.string().url(),
  muscleGroups: z.array(z.string()).min(1),
  equipment: z.string(),
  difficulty: z.string(),
  duration: z.number().nonnegative(),
  caloriesBurned: z.number().nonnegative(),
  sets: z.number().int().nonnegative(),
  reps: z.string(),
  rating: z.number().min(0).max(5),
  description: z.string(),
  instructions: z.array(z.string()),
});
export type Workout = z.infer<typeof workoutSchema>;
export type SortKey = "duration" | "caloriesBurned" | "rating";

export async function fetchWorkouts(signal?: AbortSignal): Promise<Workout[]> {
  const response = await fetch(API_URL, {
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error("The workout library is unavailable. Please try again.");
  return workoutSchema.array().parse(await response.json());
}

export async function fetchWorkout(id: string): Promise<Workout | null> {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const response = await fetch(`${API_URL}/${id}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error("Unable to load this workout. Please try again.");
  return workoutSchema.parse(await response.json());
}

export function filterAndSort<T extends Workout>(
  items: T[],
  query: string,
  sort: SortKey,
): T[] {
  const term = query.trim().toLowerCase();
  return items
    .filter((workout) =>
      `${workout.name} ${workout.muscleGroups.join(" ")}`
        .toLowerCase()
        .includes(term),
    )
    .toSorted(
      (a, b) =>
        (sort === "rating" ? b[sort] - a[sort] : a[sort] - b[sort]) ||
        a.id - b.id,
    );
}

export function assetUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
