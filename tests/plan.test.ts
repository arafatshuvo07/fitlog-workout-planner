import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyState,
  readState,
  transitionPlan,
  type PlanState,
} from "../lib/plan-state";
import { filterAndSort, workoutSchema, type Workout } from "../lib/workouts";
const workout: Workout = {
  id: 1,
  name: "Barbell Bench Press",
  image: "https://example.com/bench.jpg",
  muscleGroups: ["Chest", "Arms"],
  equipment: "Barbell, Bench",
  difficulty: "Intermediate",
  duration: 25,
  caloriesBurned: 180,
  sets: 4,
  reps: "6-8",
  rating: 4.8,
  description: "A compound chest exercise.",
  instructions: ["Brace before pressing."],
};
test("duplicate add and save are idempotent and do not alter the other list", () => {
  let state = transitionPlan(emptyState, { type: "add", workout }).state;
  assert.equal(transitionPlan(state, { type: "add", workout }).state, state);
  state = transitionPlan(state, { type: "save", workout }).state;
  assert.equal(transitionPlan(state, { type: "save", workout }).state, state);
  assert.equal(state.plan.length, 1);
  assert.equal(state.saved.length, 1);
  assert.deepEqual(emptyState.plan, []);
});
test("five-lift cap survives done status; removal releases a slot", () => {
  let state: PlanState = emptyState;
  for (let id = 1; id <= 5; id++)
    state = transitionPlan(state, {
      type: "add",
      workout: { ...workout, id },
    }).state;
  state = transitionPlan(state, { type: "toggle", id: 1 }).state;
  assert.equal(
    transitionPlan(state, { type: "add", workout: { ...workout, id: 6 } }).kind,
    "warning",
  );
  state = transitionPlan(state, { type: "remove", list: "plan", id: 2 }).state;
  state = transitionPlan(state, {
    type: "add",
    workout: { ...workout, id: 6 },
  }).state;
  assert.equal(state.plan.length, 5);
  assert.equal(state.plan[0].done, true);
});
test("completion can be undone without changing saved data or totals", () => {
  let state = transitionPlan(emptyState, { type: "add", workout }).state;
  state = transitionPlan(state, { type: "save", workout }).state;
  state = transitionPlan(state, { type: "toggle", id: 1 }).state;
  assert.equal(state.plan[0].done, true);
  state = transitionPlan(state, { type: "toggle", id: 1 }).state;
  assert.equal(state.plan[0].done, false);
  assert.equal(state.plan[0].duration, 25);
  state = transitionPlan(state, { type: "remove", list: "saved", id: 1 }).state;
  assert.equal(state.saved.length, 0);
  assert.equal(state.plan.length, 1);
});
test("persisted state round-trips and duplicate stored ids are normalized", () => {
  const item = { ...workout, done: true };
  const state = readState(
    JSON.stringify({
      version: 1,
      plan: [item, item],
      saved: [workout, workout],
    }),
  );
  assert.equal(state.plan.length, 1);
  assert.equal(state.saved.length, 1);
  assert.equal(state.plan[0].done, true);
  assert.deepEqual(readState(JSON.stringify(state)), state);
  assert.deepEqual(readState(null), emptyState);
});
test("corrupt, oversized and incompatible stored plans are rejected", () => {
  assert.throws(() => readState("{broken"));
  assert.throws(() => readState(JSON.stringify({ ...emptyState, version: 2 })));
  assert.throws(() =>
    readState(
      JSON.stringify({
        ...emptyState,
        plan: Array(6).fill({ ...workout, done: false }),
      }),
    ),
  );
  assert.throws(() =>
    readState(JSON.stringify({ ...emptyState, plan: [{ id: 1 }] })),
  );
});
test("API validation rejects malformed records instead of rendering invalid totals", () => {
  assert.equal(
    workoutSchema.safeParse({ ...workout, duration: "25" }).success,
    false,
  );
  assert.equal(
    workoutSchema.safeParse({ ...workout, rating: 9 }).success,
    false,
  );
  assert.equal(workoutSchema.safeParse(workout).success, true);
});
test("search matches case-insensitive names and tags; empty queries keep all items", () => {
  const items = [
    workout,
    { ...workout, id: 2, name: "Pull-Up", muscleGroups: ["Back"] },
  ];
  assert.deepEqual(
    filterAndSort(items, "  cHeSt ", "duration").map((w) => w.id),
    [1],
  );
  assert.deepEqual(
    filterAndSort(items, "PULL", "duration").map((w) => w.id),
    [2],
  );
  assert.equal(filterAndSort(items, "", "duration").length, 2);
  assert.equal(filterAndSort(items, "not-a-lift", "duration").length, 0);
});
test("sorting is numeric, deterministic, and never mutates source state", () => {
  const items = [
    workout,
    { ...workout, id: 2, duration: 8, caloriesBurned: 240, rating: 4.9 },
    { ...workout, id: 3, duration: 10, caloriesBurned: 60, rating: 4.2 },
  ];
  assert.deepEqual(
    filterAndSort(items, "", "duration").map((w) => w.id),
    [2, 3, 1],
  );
  assert.deepEqual(
    filterAndSort(items, "", "caloriesBurned").map((w) => w.id),
    [3, 1, 2],
  );
  assert.deepEqual(
    filterAndSort(items, "", "rating").map((w) => w.id),
    [2, 1, 3],
  );
  assert.deepEqual(
    items.map((w) => w.id),
    [1, 2, 3],
  );
});
