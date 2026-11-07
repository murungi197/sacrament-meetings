"use client";

import { useEffect, useState } from "react";

import MeetingCard from "@/components/MeetingCard";
import { getMostRecentSundayDate } from "@/lib/dates";
import type { SacramentMeeting } from "@/lib/types";

type RequestState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; meetings: SacramentMeeting[] };

export default function MeetingsList() {
  const [state, setState] = useState<RequestState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Meeting request failed with status ${response.status}.`);
        }

        const meetings: SacramentMeeting[] = await response.json();
        setState({ status: "success", meetings });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load meetings.",
        });
      }
    }

    void loadMeetings();
    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return (
      <div className="meeting-list grid gap-3" aria-busy="true" aria-label="Loading meetings">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    );
  }

  if (state.status === "error") {
    return <p className="request-error" role="alert">{state.message}</p>;
  }

  const currentSunday = getMostRecentSundayDate();
  const meetings = [...state.meetings];
  const upcoming = meetings.filter((meeting) => meeting.date >= currentSunday);
  const previous = meetings.filter((meeting) => meeting.date < currentSunday);
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  previous.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="meeting-list-section">
        <div className="section-heading list-section-heading">
          <div>
            <span className="eyebrow">Plan your visit</span>
            <h2>Current &amp; upcoming</h2>
          </div>
          <span className="list-count">{upcoming.length} gatherings</span>
        </div>
        {upcoming.length > 0 ? (
          <div className="meeting-list">
            {upcoming.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                featured={meeting.date === currentSunday}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">No upcoming meetings are listed.</p>
        )}
      </section>
      {previous.length > 0 && (
        <section className="meeting-list-section past-meetings">
          <div className="section-heading list-section-heading">
            <div>
              <span className="eyebrow">Past Sundays</span>
              <h2>Recent meetings</h2>
            </div>
            <span className="list-count">{previous.length} agendas</span>
          </div>
          <div className="meeting-list">
            {previous.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
