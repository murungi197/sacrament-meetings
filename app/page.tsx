import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import MeetingCard from "@/components/MeetingCard";
import { getCurrentMeeting } from "@/lib/meetings-db";

export default function Home() {
  return (
    <Suspense fallback={<main className="page-shell home-upcoming"><div className="skeleton skeleton-card" /></main>}>
      <HomeContent />
    </Suspense>
  );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

async function HomeContent() {
  await connection();
  const currentMeeting = await getCurrentMeeting();

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">A place to worship and belong</span>
            <h1>Come as you are.<br /><em>Worship together.</em></h1>
            <p>
              Find a moment of peace, a community of faith, and a place for
              every member of your family.
            </p>
            <div className="hero-actions">
              {currentMeeting ? (
                <Link className="button button-light" href={`/meetings/${currentMeeting.id}`}>
                  Most recent Sunday&apos;s meeting <span aria-hidden="true">↗</span>
                </Link>
              ) : (
                <Link className="button button-light" href="/meetings">
                  Browse meetings <span aria-hidden="true">↗</span>
                </Link>
              )}
              <Link className="text-link hero-secondary" href="/meetings">
                Browse all meetings <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <Image
              alt="Illustration of the sun above a chapel arch"
              className="hero-art-image"
              height={532}
              priority
              src="/sunday-arch.svg"
              width={560}
            />
            <span className="hero-art-caption">SUNDAY · TOGETHER</span>
          </div>
          <div className="hero-index" aria-hidden="true">01 / 03</div>
        </div>
      </section>
      <section className="welcome-strip">
        <div className="welcome-inner">
          <span className="welcome-icon" aria-hidden="true">✳</span>
          <p>There&apos;s a seat for you at <strong>Cedar Grove Ward.</strong></p>
          {currentMeeting && (
            <span className="welcome-date">{formatDate(currentMeeting.date)}</span>
          )}
        </div>
      </section>
      <section className="page-shell home-upcoming">
        <div className="section-heading home-meetings-heading">
          <div>
            <span className="eyebrow">Your next gathering</span>
            <h2>Sunday, together</h2>
          </div>
          <Link className="text-link" href="/meetings">
            View all meetings <span aria-hidden="true">→</span>
          </Link>
        </div>
        {currentMeeting ? (
          <MeetingCard meeting={currentMeeting} featured />
        ) : (
          <p className="empty-state">No meeting is scheduled for this Sunday.</p>
        )}
      </section>
    </main>
  );
}
