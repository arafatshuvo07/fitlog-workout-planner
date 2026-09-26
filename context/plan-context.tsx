"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast, Toaster } from "sonner";
import type { Workout } from "@/lib/workouts";
import {
  STORAGE_KEY,
  emptyState,
  readState,
  transitionPlan,
  type PlanState,
  type PlanAction,
} from "@/lib/plan-state";
export { PLAN_LIMIT } from "@/lib/plan-state";
type PlanContextValue = PlanState & {
  hydrated: boolean;
  addToPlan: (workout: Workout) => boolean;
  saveWorkout: (workout: Workout) => boolean;
  removeWorkout: (id: number, list: "plan" | "saved") => void;
  toggleDone: (id: number) => void;
};
const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlanState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const current = useRef<PlanState>(emptyState);
  const ready = useRef(false);
  const commit = useCallback((next: PlanState) => {
    current.current = next;
    setState(next);
  }, []);

  useEffect(() => {
    try {
      commit(readState(localStorage.getItem(STORAGE_KEY)));
    } catch {
      toast.warning(
        "Saved data couldn’t be restored. You can start a fresh plan.",
        { id: "restore-storage" },
      );
    }
    ready.current = true;
    setHydrated(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      try {
        commit(readState(event.newValue));
      } catch {
        /* Keep the last valid state when another tab writes invalid data. */
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [commit]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast.warning(
        "Browser storage is unavailable. Your changes will last for this visit only.",
        { id: "storage-unavailable" },
      );
    }
  }, [state, hydrated]);

  const dispatch = useCallback(
    (action: PlanAction) => {
      if (!ready.current) return false;
      const result = transitionPlan(current.current, action);
      const changed = result.state !== current.current;
      if (changed) commit(result.state);
      toast[result.kind](result.message);
      return changed;
    },
    [commit],
  );
  const addToPlan = useCallback(
    (workout: Workout) => dispatch({ type: "add", workout }),
    [dispatch],
  );
  const saveWorkout = useCallback(
    (workout: Workout) => dispatch({ type: "save", workout }),
    [dispatch],
  );
  const removeWorkout = useCallback(
    (id: number, list: "plan" | "saved") => {
      dispatch({ type: "remove", id, list });
    },
    [dispatch],
  );
  const toggleDone = useCallback(
    (id: number) => {
      dispatch({ type: "toggle", id });
    },
    [dispatch],
  );
  return (
    <PlanContext.Provider
      value={{
        ...state,
        hydrated,
        addToPlan,
        saveWorkout,
        removeWorkout,
        toggleDone,
      }}
    >
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{ duration: 3500 }}
      />
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used inside PlanProvider");
  return context;
}
