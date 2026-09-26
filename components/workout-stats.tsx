import { Clock3, Flame, Star } from "lucide-react";
import type { Workout } from "@/lib/workouts";
export function WorkoutStats({ workout }: { workout: Workout }) {
  return (
    <div className="workout-stats">
      <span>
        <Clock3 aria-hidden="true" />
        {workout.duration} min
      </span>
      <span>
        <Flame aria-hidden="true" />
        {workout.caloriesBurned} kcal
      </span>
      <span>
        <Star aria-hidden="true" />
        {workout.rating.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
    </div>
  );
}
