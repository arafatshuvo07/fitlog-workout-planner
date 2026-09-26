"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { assetUrl } from "@/lib/workouts";
import { usePlan } from "@/context/plan-context";
export function SiteHeader() {
  const pathname = usePathname();
  const isPlan = pathname.startsWith("/my-plan");
  const isWorkout = pathname === "/" || pathname.startsWith("/workouts/");
  const { plan, saved } = usePlan();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="FitLog home">
          <Image src={assetUrl("/logo.png")} width={28} height={28} alt="" />
          FITLOG
        </Link>
        <nav aria-label="Main navigation">
          <Link
            href="/"
            className={isWorkout ? "active" : ""}
            aria-current={isWorkout ? "page" : undefined}
          >
            Workout
          </Link>
          <Link
            href="/my-plan"
            className={isPlan ? "active" : ""}
            aria-current={isPlan ? "page" : undefined}
          >
            My Plan
          </Link>
        </nav>
        <div className="header-badges" aria-live="polite">
          <Link
            className="badge badge-plan"
            href="/my-plan?tab=plan"
            aria-label={`Plan, ${plan.length} workouts`}
          >
            Plan <strong>{plan.length}</strong>
          </Link>
          <Link
            className="badge badge-saved"
            href="/my-plan?tab=saved"
            aria-label={`Saved, ${saved.length} workouts`}
          >
            Saved <strong>{saved.length}</strong>
          </Link>
        </div>
      </div>
    </header>
  );
}
