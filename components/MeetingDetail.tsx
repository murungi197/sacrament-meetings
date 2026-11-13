import Link from "next/link";

import PrintButton from "@/components/PrintButton";
import type { Hymn, SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
  backHref: string;
  meeting: SacramentMeeting;
  printMode?: boolean;
}

function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function HymnLine({ label, hymn }: { label: string; hymn: Hymn }) {
  return (
    <li className="agenda-row">
      <h3>{label}</h3>
      <p>Hymn {hymn.number} · {hymn.title}</p>
    </li>
  );
}

export default function MeetingDetail({
  backHref,
  meeting,
  printMode = false,
}: MeetingDetailProps) {
  return (
    <main className={`page-shell detail-shell flex flex-col${printMode ? " print-mode" : ""}`}>
      <div className="detail-topline">
        <Link className="back-link" href={backHref}>
          <span aria-hidden="true">←</span> All meetings
        </Link>
        {printMode ? (
          <span className="print-view-label">Print view</span>
        ) : (
          <PrintButton />
        )}
      </div>
      <section className="detail-heading">
        <span className="eyebrow">Cedar Grove Ward · {meeting.meetingType} meeting</span>
        <h1>{formatLongDate(meeting.date)}</h1>
      </section>
      <section className="meeting-meta" aria-label="Meeting information">
        <div>
          <span className="meta-label">Presiding</span>
          <strong>{meeting.presiding}</strong>
        </div>
        <div>
          <span className="meta-label">Conducting</span>
          <strong>{meeting.conducting}</strong>
        </div>
        <div>
          <span className="meta-label">Meeting type</span>
          <strong>{meeting.meetingType}</strong>
        </div>
        <div>
          <span className="meta-label">Stake business</span>
          <strong>{meeting.stakeBusiness ? "Included" : "None scheduled"}</strong>
        </div>
      </section>
      <section className="agenda-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Order of worship</span>
            <h2>Meeting agenda</h2>
          </div>
        </div>
        <ol className="agenda-list">
          <HymnLine label="Opening hymn" hymn={meeting.openingHymn} />
          <li className="agenda-row">
            <h3>Opening prayer</h3>
            <p>{meeting.openingPrayer}</p>
          </li>
          {meeting.announcements && meeting.announcements.length > 0 && (
            <li className="agenda-row">
              <h3>Announcements</h3>
              <ul>
                {meeting.announcements.map((announcement) => (
                  <li key={announcement}>{announcement}</li>
                ))}
              </ul>
            </li>
          )}
          {meeting.wardBusiness.length > 0 && (
            <li className="agenda-row">
              <h3>Ward business</h3>
              <ul>
                {meeting.wardBusiness.map((item) => (
                  <li key={item.description}>{item.description}</li>
                ))}
              </ul>
            </li>
          )}
          {meeting.stakeBusiness && (
            <li className="agenda-row">
              <h3>Stake business</h3>
              <p>Stake announcements and business will be shared during the meeting.</p>
            </li>
          )}
          <HymnLine label="Sacrament hymn" hymn={meeting.sacramentHymn} />
          <li className="agenda-row">
            <h3>Administration of the sacrament</h3>
          </li>
          {meeting.speakers.map((item, index) => (
            <li className="agenda-row" key={`${item.name}-${index}`}>
              <h3>{item.type === "speaker" ? "Speaker" : "Musical number"}</h3>
              <p>
                <strong>{item.name}</strong>
                {item.topic ? ` · ${item.topic}` : ""}
              </p>
            </li>
          ))}
          <HymnLine label="Closing hymn" hymn={meeting.closingHymn} />
          <li className="agenda-row">
            <h3>Closing prayer</h3>
            <p>{meeting.closingPrayer}</p>
          </li>
        </ol>
      </section>
      <aside className="detail-note">
        <span className="note-icon" aria-hidden="true">✦</span>
        <p>Visitors are always welcome. We look forward to worshipping with you.</p>
      </aside>
    </main>
  );
}
