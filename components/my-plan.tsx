"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bookmark,
  Check,
  Clock3,
  Dumbbell,
  Flame,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { usePlan, PLAN_LIMIT } from "@/context/plan-context";
import { filterAndSort, type SortKey, type Workout } from "@/lib/workouts";
import { WorkoutImage } from "./workout-image";
import { WorkoutStats } from "./workout-stats";
import { loadCatalog } from "@/lib/workout-catalog";
import { ListControls } from "./list-controls";
import { LoadingWorkouts } from "./loading-workouts";

export function MyPlan() {
  const { plan, saved, hydrated, addToPlan, removeWorkout, toggleDone } =
    usePlan();
  const params = useSearchParams();
  const router = useRouter();
  const tab = params.get("tab") === "saved" ? "saved" : "plan";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("duration");
  const [catalog, setCatalog] = useState<Workout[]>([]);
  const [fetching, setFetching] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setFetching(true);
    setFailed(false);
    loadCatalog(controller.signal)
      .then(({ workouts, source }) => {
        if (controller.signal.aborted) return;
        setCatalog(workouts);
        setFailed(source === "saved");
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setFetching(false);
      });
    return () => controller.abort();
  }, [attempt]);
  const fresh = (workout: Workout) =>
    catalog.find((item) => item.id === workout.id) || workout;
  const planned = plan.map((item) => ({ ...fresh(item), done: item.done }));
  const list =
    tab === "plan"
      ? planned
      : saved.map((item) => ({ ...fresh(item), done: false }));
  const visible = filterAndSort(list, query, sort);
  const minutes = planned.reduce((sum, item) => sum + item.duration, 0);
  const calories = planned.reduce((sum, item) => sum + item.caloriesBurned, 0);
  const selectTab = (next: "plan" | "saved") => {
    setQuery("");
    router.replace(`/my-plan?tab=${next}`, { scroll: false });
  };
  return (
    <>
      <section className="plan-heading">
        <h1>MY PLAN</h1>
        <p>Cap of five lifts for today. Finish them, then load more.</p>
      </section>
      <section
        className="metrics"
        aria-label="Today’s plan summary"
        aria-live="polite"
      >
        {[
          { label: "Exercises", value: planned.length, Icon: Dumbbell },
          { label: "Minutes", value: minutes, Icon: Clock3 },
          { label: "Calories", value: calories, Icon: Flame },
        ].map(({ label, value, Icon }) => (
          <div className="metric" key={label}>
            <div className="metric-label">
              <Icon aria-hidden="true" />
              {label}
            </div>
            <strong data-testid={`metric-${label.toLowerCase()}`}>
              {value}
            </strong>
          </div>
        ))}
      </section>
      <div className="plan-toolbar">
        <div className="tabs" role="tablist" aria-label="Workout lists">
          {(["plan", "saved"] as const).map((key) => (
            <button
              type="button"
              role="tab"
              key={key}
              id={`tab-${key}`}
              aria-selected={tab === key}
              aria-controls={`panel-${key}`}
              tabIndex={tab === key ? 0 : -1}
              onClick={() => selectTab(key)}
              onKeyDown={(event) => {
                if (
                  ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? "plan"
                      : event.key === "End"
                        ? "saved"
                        : tab === "plan"
                          ? "saved"
                          : "plan";
                  selectTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
            >
              {key === "plan" ? "Today's Plan" : "Saved"}
            </button>
          ))}
        </div>
        <ListControls
          id="plan"
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />
      </div>
      {failed && (
        <div className="refresh-notice" role="status">
          Live data couldn’t be refreshed. Your stored workouts are still
          available.
          <button onClick={() => setAttempt((value) => value + 1)}>
            <RotateCcw />
            Retry
          </button>
        </div>
      )}
      <section
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className="plan-list"
      >
        {!hydrated || fetching ? (
          <LoadingWorkouts />
        ) : list.length === 0 ? (
          <div className="empty-state">
            <Dumbbell aria-hidden="true" />
            <h2>NOTHING HERE YET</h2>
            <p>Browse the library and add a lift to get today moving.</p>
            <Link href="/" className="button primary">
              <Plus />
              Go to workouts
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <h2>NO MATCHING WORKOUTS</h2>
            <p>Try another name or muscle group.</p>
            <button className="button secondary" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        ) : (
          visible.map((workout) => (
            <article
              className={`plan-card${workout.done ? " is-done" : ""}`}
              key={workout.id}
              aria-label={workout.name}
            >
              <Link
                href={`/workouts/${workout.id}`}
                className="plan-thumbnail"
                aria-label={`View ${workout.name}`}
              >
                <WorkoutImage workout={workout} />
              </Link>
              <div className="plan-card-info">
                <h2>
                  {workout.name}
                  {workout.done && (
                    <span className="done-badge">
                      <Check />
                      Done
                    </span>
                  )}
                </h2>
                <p className="equipment">{workout.equipment}</p>
                <WorkoutStats workout={workout} />
              </div>
              <div className="plan-card-actions">
                <Link
                  className="button secondary compact"
                  href={`/workouts/${workout.id}`}
                >
                  View Details
                </Link>
                {tab === "plan" ? (
                  <button
                    className={`button compact ${workout.done ? "done-button" : "primary"}`}
                    aria-pressed={workout.done}
                    onClick={() => toggleDone(workout.id)}
                  >
                    {workout.done ? <RotateCcw /> : <Check />}
                    {workout.done ? "Undo Done" : "Mark as Done"}
                  </button>
                ) : (
                  <button
                    className="button primary compact"
                    disabled={
                      plan.length >= PLAN_LIMIT ||
                      plan.some((item) => item.id === workout.id)
                    }
                    onClick={() => addToPlan(workout)}
                  >
                    {plan.some((item) => item.id === workout.id) ? (
                      <Check />
                    ) : (
                      <Plus />
                    )}
                    {plan.some((item) => item.id === workout.id)
                      ? "In today’s plan"
                      : "Add to plan"}
                  </button>
                )}
                <button
                  className="remove-button"
                  aria-label={`Remove ${workout.name} from ${tab === "plan" ? "today’s plan" : "saved"}`}
                  onClick={() => removeWorkout(workout.id, tab)}
                >
                  <X />
                </button>
              </div>
            </article>
          ))
        )}
      </section>
      {tab === "saved" && plan.length >= PLAN_LIMIT && saved.length > 0 && (
        <p className="limit-note">
          <Bookmark className="inline-icon" />
          Your plan has five lifts. Remove one to add a saved workout.
        </p>
      )}
    </>
  );
}
