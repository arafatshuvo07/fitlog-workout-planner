"use client";
import Image from "next/image";
import { useState } from "react";
import { assetUrl, type Workout } from "@/lib/workouts";

export function WorkoutImage({
  workout,
  priority = false,
}: {
  workout: Workout;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? assetUrl("/banner.png") : workout.image}
      alt={workout.name}
      width={740}
      height={740}
      className="workout-image"
      priority={priority}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
