import type { Metadata } from "next";
import { Suspense } from "react";

import MeetingDetailLoader from "@/components/MeetingDetailLoader";
import MeetingsLoading from "@/app/meetings/loading";

export const metadata: Metadata = {
  title: "Meeting agenda",
};

interface MeetingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string | string[] }>;
}

export default function MeetingPage(props: MeetingPageProps) {
  return (
    <Suspense fallback={<MeetingsLoading />}>
      <MeetingPageContent {...props} />
    </Suspense>
  );
}

async function MeetingPageContent({
  params,
  searchParams,
}: MeetingPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const printValue = Array.isArray(query.print) ? query.print[0] : query.print;
  const printMode = printValue === "true" || printValue === "1";

  return <MeetingDetailLoader meetingId={id} printMode={printMode} />;
}
