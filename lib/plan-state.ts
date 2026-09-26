import { z } from "zod";
import { workoutSchema, type Workout } from "./workouts";

export const PLAN_LIMIT = 5;
export const STORAGE_KEY = "fitlog:plan:v1";
const stateSchema = z.object({
  version: z.literal(1),
  plan: z.array(workoutSchema.extend({ done: z.boolean() })).max(PLAN_LIMIT),
  saved: z.array(workoutSchema).max(1000),
});
export type PlanState = z.infer<typeof stateSchema>;
export const emptyState: PlanState = { version: 1, plan: [], saved: [] };
export type PlanAction =
  | { type: "add" | "save"; workout: Workout }
  | { type: "remove"; id: number; list: "plan" | "saved" }
  | { type: "toggle"; id: number };

export function readState(value: string | null): PlanState {
  if (!value) return emptyState;
  const parsed = stateSchema.parse(JSON.parse(value));
  return {
    ...parsed,
    plan: parsed.plan.filter(
      (item, i, all) => all.findIndex((w) => w.id === item.id) === i,
    ),
    saved: parsed.saved.filter(
      (item, i, all) => all.findIndex((w) => w.id === item.id) === i,
    ),
  };
}

export function transitionPlan(
  state: PlanState,
  action: PlanAction,
): { state: PlanState; kind: "success" | "info" | "warning"; message: string } {
  switch (action.type) {
    case "add":
      if (state.plan.some((item) => item.id === action.workout.id))
        return {
          state,
          kind: "info",
          message: "This workout is already in today’s plan.",
        };
      if (state.plan.length >= PLAN_LIMIT)
        return {
          state,
          kind: "warning",
          message: "Your plan is full. Remove a lift before adding another.",
        };
      return {
        state: {
          ...state,
          plan: [...state.plan, { ...action.workout, done: false }],
        },
        kind: "success",
        message: "Added to today’s plan",
      };
    case "save":
      if (state.saved.some((item) => item.id === action.workout.id))
        return {
          state,
          kind: "info",
          message: "This workout is already saved.",
        };
      return {
        state: { ...state, saved: [...state.saved, action.workout] },
        kind: "success",
        message: "Workout saved for later",
      };
    case "remove":
      return {
        state: {
          ...state,
          [action.list]: state[action.list].filter(
            (item) => item.id !== action.id,
          ),
        },
        kind: "success",
        message:
          action.list === "plan"
            ? "Removed from today’s plan"
            : "Removed from saved workouts",
      };
    case "toggle": {
      const workout = state.plan.find((item) => item.id === action.id);
      if (!workout)
        return {
          state,
          kind: "info",
          message: "This workout is no longer in your plan.",
        };
      return {
        state: {
          ...state,
          plan: state.plan.map((item) =>
            item.id === action.id ? { ...item, done: !item.done } : item,
          ),
        },
        kind: "success",
        message: workout.done
          ? "Workout marked as not done"
          : "Workout complete. Nice work!",
      };
    }
  }
}
