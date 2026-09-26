import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { loadWorkout, loadCatalog } from "@/lib/workout-catalog";
import { WorkoutImage } from "@/components/workout-image";
import { WorkoutActions } from "@/components/workout-actions";

export const dynamicParams = false;
const getWorkout = cache(loadWorkout);
export async function generateStaticParams() {
  return (await loadCatalog()).workouts.map((workout) => ({
    id: String(workout.id),
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const result = await getWorkout((await params).id);
  return {
    title: result?.workout.name || "Workout not found",
    description: result?.workout.description,
  };
}
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const result = await getWorkout((await params).id);
  if (!result) notFound();
  const { workout, source } = result;
  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", workout.sets],
    ["Reps", workout.reps],
    ["Duration", `${workout.duration} min`],
    ["Calories", `${workout.caloriesBurned} kcal`],
    ["Rating", `${workout.rating.toFixed(1)} / 5`],
  ];
  return (
    <main id="main-content" className="shell detail-main">
      <div className="detail-grid">
        <div className="detail-media">
          <WorkoutImage workout={workout} priority />
        </div>
        <section className="detail-info" aria-labelledby="workout-title">
          {source === "saved" && (
            <p className="refresh-notice" role="status">
              Live details were unavailable when this page was built. Showing
              saved workout details.
            </p>
          )}
          <h1 id="workout-title">{workout.name}</h1>
          <p className="detail-description">{workout.description}</p>
          <div className="tags">
            {workout.muscleGroups.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <dl className="specs">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <section
            className="instructions"
            aria-labelledby="instructions-title"
          >
            <h2 id="instructions-title">INSTRUCTIONS</h2>
            <ol>
              {workout.instructions.map((step, i) => (
                <li key={step}>
                  <span className="step-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
          <WorkoutActions workout={workout} />
        </section>
      </div>
    </main>
  );
}
