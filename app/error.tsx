"use client";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main id="main-content" className="shell route-loading">
      <div className="empty-state" role="alert">
        <AlertCircle />
        <h1>LET’S TRY THAT AGAIN.</h1>
        <p>We couldn’t load this page. Check your connection and try again.</p>
        <div className="action-row">
          <button className="button primary" onClick={retry}>
            <RotateCcw />
            Try again
          </button>
          <Link className="button secondary" href="/">
            Go to workouts
          </Link>
        </div>
      </div>
    </main>
  );
}
