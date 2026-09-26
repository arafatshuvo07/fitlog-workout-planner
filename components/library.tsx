"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import {
  fetchWorkouts,
  filterAndSort,
  type SortKey,
  type Workout,
} from "@/lib/workouts";
import { WorkoutImage } from "./workout-image";
import { WorkoutStats } from "./workout-stats";
import { LoadingWorkouts } from "./loading-workouts";
import { ListControls } from "./list-controls";
export function Library() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("duration");
  const visible = filterAndSort(workouts, query, sort);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetchWorkouts(controller.signal)
      .then(setWorkouts)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  return (
    <section id="library" className="library" aria-labelledby="library-title">
      <div className="section-heading">
        <div>
          <h2 id="library-title">THE LIBRARY</h2>
          <p>Twelve lifts covering every major muscle group.</p>
        </div>
        <ListControls
          id="library"
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />
      </div>
      {loading ? (
        <LoadingWorkouts cards />
      ) : error ? (
        <div className="empty-state" role="alert">
          <AlertCircle />
          <h3>COULDN’T LOAD WORKOUTS</h3>
          <p>Check your connection and give it another try.</p>
          <button
            className="button primary"
            onClick={() => setAttempt((a) => a + 1)}
          >
            <RotateCcw />
            Try again
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <h3>NO MATCHING WORKOUTS</h3>
          <p>Try a workout name or a muscle group like Chest or Core.</p>
          <button className="button secondary" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="workout-grid">
          {visible.map((workout) => (
            <Link
              className="workout-card"
              href={`/workouts/${workout.id}`}
              key={workout.id}
            >
              <div className="card-media">
                <WorkoutImage workout={workout} />
              </div>
              <div className="card-content">
                <div className="tags">
                  {workout.muscleGroups.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <h3>{workout.name}</h3>
                <p className="equipment">{workout.equipment}</p>
                <WorkoutStats workout={workout} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
