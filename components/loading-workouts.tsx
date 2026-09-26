import { LoaderCircle } from "lucide-react";
export function LoadingWorkouts({ cards = false }: { cards?: boolean }) {
  return (
    <div aria-busy="true">
      <div className="loading-state" role="status">
        <LoaderCircle className="spin" aria-hidden="true" />
        Loading workouts…
      </div>
      {cards && (
        <div className="workout-grid" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-media" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
