import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchWorkout, fetchWorkouts } from "../lib/workouts";

test("library fetch rejects a failed upstream response", async (context) => {
  context.mock.method(
    globalThis,
    "fetch",
    async () => new Response("Unavailable", { status: 503 }),
  );
  await assert.rejects(fetchWorkouts(), /unavailable/);
});
test("library fetch rejects malformed successful responses", async (context) => {
  context.mock.method(globalThis, "fetch", async () =>
    Response.json([{ id: 1, name: "Incomplete exercise" }]),
  );
  await assert.rejects(fetchWorkouts());
});
test("invalid and missing workout IDs become not-found rather than render failures", async (context) => {
  const mock = context.mock.method(
    globalThis,
    "fetch",
    async () => new Response("Not found", { status: 404 }),
  );
  assert.equal(await fetchWorkout("bad-id"), null);
  assert.equal(mock.mock.callCount(), 0);
  assert.equal(await fetchWorkout("9999"), null);
  assert.equal(mock.mock.callCount(), 1);
});
test("cancelled library requests preserve the abort signal", async (context) => {
  context.mock.method(
    globalThis,
    "fetch",
    async (_input: unknown, options?: RequestInit) => {
      options?.signal?.throwIfAborted();
      return Response.json([]);
    },
  );
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchWorkouts(controller.signal), {
    name: "AbortError",
  });
});
