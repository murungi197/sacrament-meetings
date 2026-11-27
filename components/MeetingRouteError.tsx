"use client";

import { useEffect } from "react";
import Link from "next/link";

interface MeetingRouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MeetingRouteError({
  error,
  reset,
}: MeetingRouteErrorProps) {
  useEffect(() => {
    console.error("Meetings route failed:", error);
  }, [error]);

  return (
    <main className="page-shell meetings-page">
      <span className="eyebrow">Cedar Grove Ward</span>
      <h1>We couldn&apos;t load the meetings.</h1>
      <p className="mt-3 text-stone-700">
        Something went wrong while loading this page. Please try again.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <button className="button button-dark" type="button" onClick={reset}>
          Try Again
        </button>
        <Link className="button button-outline" href="/meetings">Back to meetings</Link>
      </div>
    </main>
  );
}
