import type { Metadata } from "next";
import Link from "next/link";

import MeetingsList from "@/components/MeetingsList";

export const metadata: Metadata = {
  title: "All meetings",
};

export default function MeetingsPage() {
  return (
    <main className="page-shell meetings-page">
      <section className="page-intro">
        <span className="eyebrow">Cedar Grove Ward</span>
        <h1>Meetings &amp; agendas</h1>
        <p>Come worship with us. Explore upcoming Sunday meetings and revisit recent agendas.</p>
        <Link className="current-meeting-link" href="/meetings/current">
          <span className="current-pulse" aria-hidden="true" />
          Find the most recent Sunday meeting <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <MeetingsList />
    </main>
  );
}
