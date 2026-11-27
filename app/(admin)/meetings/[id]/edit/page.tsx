import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";

interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMeetingPage({ params }: EditMeetingPageProps) {
  return (
    <Suspense
      fallback={
        <main className="page-shell meetings-page" aria-busy="true">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-card" />
        </main>
      }
    >
      <EditMeetingPageContent params={params} />
    </Suspense>
  );
}

async function EditMeetingPageContent({ params }: EditMeetingPageProps) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isSafeInteger(meetingId) || meetingId < 1) notFound();

  const meeting = await getMeetingById(meetingId);
  if (!meeting) notFound();

  return (
    <main className="page-shell meetings-page">
      <span className="eyebrow">Ward leadership</span>
      <h1 className="mt-3 font-serif text-4xl text-stone-900">Edit meeting agenda</h1>
      <p className="mt-3 max-w-2xl text-stone-700">
        Update the program and agenda for this meeting.
      </p>
      <MeetingForm
        action={updateMeeting.bind(null, id)}
        meeting={meeting}
        submitLabel="Save changes"
      />
      <Link className="mt-6 inline-block text-link" href={`/meetings/${id}`}>Cancel</Link>
    </main>
  );
}
