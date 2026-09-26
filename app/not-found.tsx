import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main-content" className="shell not-found">
      <Dumbbell aria-hidden="true" />
      <p className="eyebrow">404 · OUT OF RANGE</p>
      <h1>THIS LIFT DOESN’T EXIST.</h1>
      <p>
        The page or workout you’re looking for couldn’t be found.
        <br />
        Let’s get you back to the library.
      </p>
      <Link className="button primary" href="/">
        <ArrowLeft />
        Go to workouts
      </Link>
    </main>
  );
}
