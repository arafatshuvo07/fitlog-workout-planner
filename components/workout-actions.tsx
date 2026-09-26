"use client";
import { Bookmark, Check, Plus } from "lucide-react";
import { usePlan, PLAN_LIMIT } from "@/context/plan-context";
import type { Workout } from "@/lib/workouts";
export function WorkoutActions({ workout }: { workout: Workout }) {
  const { plan, saved, hydrated, addToPlan, saveWorkout } = usePlan();
  const isPlanned = plan.some((item) => item.id === workout.id);
  const isSaved = saved.some((item) => item.id === workout.id);
  const full = plan.length >= PLAN_LIMIT;
  return (
    <div className="workout-actions">
      <div className="action-row">
        <button
          className="button primary"
          disabled={!hydrated || isPlanned || full}
          onClick={() => addToPlan(workout)}
        >
          {isPlanned ? <Check /> : <Plus />}
          {isPlanned ? "Added to today’s plan" : "Add to today’s plan"}
        </button>
        <button
          className="button secondary"
          disabled={!hydrated || isSaved}
          onClick={() => saveWorkout(workout)}
        >
          {isSaved ? <Check /> : <Bookmark />}
          {isSaved ? "Saved for later" : "Save for later"}
        </button>
      </div>
      {full && !isPlanned && (
        <p className="limit-note" role="status">
          Your plan has five lifts. Remove one in My Plan to make room.
        </p>
      )}
    </div>
  );
}
