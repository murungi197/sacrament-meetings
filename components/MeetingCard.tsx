import Link from "next/link";

import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
  featured?: boolean;
}

function formatDate(date: string): { month: string; day: string; full: string } {
  const value = new Date(`${date}T12:00:00`);
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(value),
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(value),
    full: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(value),
  };
}

function formatMeetingType(type: SacramentMeeting["meetingType"]): string {
  return `${type.charAt(0).toUpperCase()}${type.slice(1)} meeting`;
}

export default function MeetingCard({
  meeting,
  featured = false,
}: MeetingCardProps) {
  const meetingDate = formatDate(meeting.date);
  const speakerCount = meeting.speakers.filter((item) => item.type === "speaker").length;
  const musicalNumberCount = meeting.speakers.filter(
    (item) => item.type === "musical-number",
  ).length;

  return (
    <article className={`meeting-card flex items-center${featured ? " meeting-card-featured" : ""}`}>
      <time className="card-date" dateTime={meeting.date} aria-label={meetingDate.full}>
        <span>{meetingDate.month}</span>
        <strong>{meetingDate.day}</strong>
      </time>
      <div className="card-content">
        <div className="card-eyebrow">
          <span className="meeting-status">
            {featured ? "Most recent Sunday" : formatMeetingType(meeting.meetingType)}
          </span>
          <span className="card-time">{meetingDate.full}</span>
        </div>
        <h3>{formatMeetingType(meeting.meetingType)}</h3>
        <p>
          {speakerCount} {speakerCount === 1 ? "speaker" : "speakers"}
          {musicalNumberCount > 0
            ? ` · ${musicalNumberCount} musical ${musicalNumberCount === 1 ? "number" : "numbers"}`
            : ""}
        </p>
      </div>
      <Link
        className="card-link"
        href={`/meetings/${meeting.id}`}
        aria-label={`View meeting agenda for ${meetingDate.full}`}
      >
        <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
