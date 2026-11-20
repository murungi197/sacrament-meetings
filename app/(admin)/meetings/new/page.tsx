"use client";

import Link from "next/link";

import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export default function NewMeetingPage() {
  return (
    <main className="page-shell meetings-page">
      <span className="eyebrow">Ward leadership</span>
      <h1 className="mt-3 font-serif text-4xl text-stone-900">Create a meeting</h1>
      <p className="mt-3 max-w-2xl text-stone-700">
        Add the meeting agenda and program details. Announcements and ward business are entered one per line.
      </p>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" />
      <Link className="mt-6 inline-block text-link" href="/meetings">Cancel</Link>
    </main>
  );
}
