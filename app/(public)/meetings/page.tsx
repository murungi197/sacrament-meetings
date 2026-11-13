import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import MeetingCard from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

export const metadata: Metadata = {
  title: "All meetings",
};

interface MeetingsPageProps {
  searchParams?: Promise<{
    query?: string | string[];
    page?: string | string[];
  }>;
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function MeetingsPage(props: MeetingsPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const query = firstParam(searchParams.query);
  const pageParam = firstParam(searchParams.page);
  const requestedPage = Number(pageParam);
  const currentPage = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

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

      <section className="meeting-list-section" aria-labelledby="meeting-results-heading">
        <div className="section-heading list-section-heading">
          <div>
            <span className="eyebrow">Cedar Grove Ward</span>
            <h2 id="meeting-results-heading">Meeting agendas</h2>
          </div>
          <span className="list-count">{meetings.length} on this page</span>
        </div>

        <div className="meeting-search-row">
          <Suspense fallback={<div className="meeting-search-skeleton" aria-hidden="true" />}>
            <MeetingSearch />
          </Suspense>
        </div>

        {meetings.length > 0 ? (
          <div className="meeting-list">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                returnQuery={query}
                returnPage={pageParam}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state" role="status">
            {query ? `No meetings matched “${query}”.` : "No meetings are listed."}
          </p>
        )}

        <Suspense fallback={null}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </section>
    </main>
  );
}
