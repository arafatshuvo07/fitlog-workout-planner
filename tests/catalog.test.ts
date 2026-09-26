import { test } from "node:test";
import assert from "node:assert/strict";
import snapshot from "../data/workouts.json";
import { loadCatalog, loadWorkout } from "../lib/workout-catalog";

test("live API data takes precedence over the saved catalog", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json([snapshot[0]]));
  const result = await loadCatalog();
  assert.equal(result.source, "live");
  assert.equal(result.workouts.length, 1);
});
for (const status of [403, 429, 503]) {
  test(`HTTP ${status} keeps all twelve saved workouts available`, async (t) => {
    t.mock.method(
      globalThis,
      "fetch",
      async () => new Response("Unavailable", { status }),
    );
    const result = await loadCatalog();
    assert.equal(result.source, "saved");
    assert.equal(result.workouts.length, 12);
    assert.ok(result.workouts.every((item) => item.instructions.length === 4));
    assert.equal((await loadWorkout("1"))?.workout.id, 1);
    assert.equal((await loadWorkout("1"))?.source, "saved");
    assert.equal(await loadWorkout("9999"), null);
  });
}
test("network failures and malformed or empty responses use the snapshot", async (t) => {
  const mock = t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("fetch failed");
  });
  assert.equal((await loadCatalog()).source, "saved");
  mock.mock.mockImplementation(async () => Response.json([]));
  assert.equal((await loadCatalog()).source, "saved");
  mock.mock.mockImplementation(async () => Response.json([{ id: 1 }]));
  assert.equal((await loadCatalog()).source, "saved");
});
test("cancelled requests are not converted into successful fallback loads", async (t) => {
  const controller = new AbortController();
  t.mock.method(globalThis, "fetch", async () => {
    controller.abort();
    throw new DOMException("Aborted", "AbortError");
  });
  await assert.rejects(loadCatalog(controller.signal), { name: "AbortError" });
});
test("explicit missing and invalid workout IDs remain not found", async (t) => {
  const mock = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("Missing", { status: 404 }),
  );
  assert.equal(await loadWorkout("bad-id"), null);
  assert.equal(mock.mock.callCount(), 0);
  assert.equal(await loadWorkout("1"), null);
});
