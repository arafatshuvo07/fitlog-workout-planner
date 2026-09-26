import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { Library } from "@/components/library";
import { assetUrl } from "@/lib/workouts";
export default function HomePage() {
  return (
    <main id="main-content" className="shell home-main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">WORKOUT LIBRARY</p>
          <h1 id="hero-title">TRAIN WITH INTENT. LOG EVERY SET.</h1>
          <p className="hero-description">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today’s plan, and watch the week’s work add up.
          </p>
          <a className="button primary" href="#library">
            <Dumbbell aria-hidden="true" />
            BROWSE WORKOUTS
          </a>
        </div>
        <Image
          className="hero-image"
          src={assetUrl("/banner.png")}
          alt="Anatomical illustration of a seated strength exercise highlighting the arm muscles"
          width={334}
          height={334}
          priority
        />
      </section>
      <Library />
    </main>
  );
}
