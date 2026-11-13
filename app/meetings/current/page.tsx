import { redirect } from "next/navigation";
import { connection } from "next/server";

import { getCurrentMeeting } from "@/lib/meetings-db";

export const instant = false;

export default async function CurrentMeetingPage() {
  await connection();
  const meeting = await getCurrentMeeting();
  return redirect(meeting ? `/meetings/${meeting.id}` : "/meetings");
}
