import type { Metadata } from "next";
import { Suspense } from "react";

import MeetingDetailLoader from "@/components/MeetingDetailLoader";
import MeetingsLoading from "@/app/(public)/meetings/loading";

export const metadata: Metadata = {
  title: "Meeting agenda",
};

interface MeetingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    print?: string | string[];
    query?: string | string[];
    page?: string | string[];
  }>;
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
  const searchQuery = Array.isArray(query.query) ? query.query[0] : query.query;
  const page = Array.isArray(query.page) ? query.page[0] : query.page;
  const printMode = printValue === "true" || printValue === "1";
  const returnParams = new URLSearchParams();
  if (searchQuery) returnParams.set("query", searchQuery);
  if (page) returnParams.set("page", page);
  const returnQuery = returnParams.toString();
  const backHref = returnQuery ? `/meetings?${returnQuery}` : "/meetings";

  return <MeetingDetailLoader backHref={backHref} meetingId={id} printMode={printMode} />;
}
