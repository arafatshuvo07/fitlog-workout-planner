import type { Metadata } from "next";
import { Suspense } from "react";
import { MyPlan } from "@/components/my-plan";
import { LoadingWorkouts } from "@/components/loading-workouts";
export const metadata: Metadata = {
  title: "My Plan",
  description:
    "Your workout plan and saved lifts. Track exercises, minutes and calories, and mark each workout complete.",
};
export default function MyPlanPage() {
  return (
    <main id="main-content" className="shell plan-main">
      <Suspense fallback={<LoadingWorkouts />}>
        <MyPlan />
      </Suspense>
    </main>
  );
}
