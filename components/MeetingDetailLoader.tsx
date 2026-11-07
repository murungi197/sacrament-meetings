"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MeetingDetail from "@/components/MeetingDetail";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailLoaderProps {
  meetingId: string;
  printMode: boolean;
}

type RequestState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "not-found" }
  | { status: "success"; meeting: SacramentMeeting };

export default function MeetingDetailLoader({
  meetingId,
  printMode,
}: MeetingDetailLoaderProps) {
  const [state, setState] = useState<RequestState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeeting() {
      try {
        const response = await fetch(
          `/api/meetings/${encodeURIComponent(meetingId)}`,
          { signal: controller.signal },
        );
        if (response.status === 404 || response.status === 400) {
          setState({ status: "not-found" });
          return;
        }
        if (!response.ok) {
          throw new Error(`Meeting request failed with status ${response.status}.`);
        }

        const meeting: SacramentMeeting = await response.json();
        setState({ status: "success", meeting });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load this meeting.",
        });
      }
    }

    void loadMeeting();
    return () => controller.abort();
  }, [meetingId]);

  if (state.status === "loading") {
    return (
      <main className="page-shell meetings-page" aria-busy="true">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-card" />
      </main>
    );
  }

  if (state.status === "not-found") {
    return (
      <main className="page-shell not-found-page">
        <span className="eyebrow">Cedar Grove Ward</span>
        <h1>We couldn&apos;t find that meeting.</h1>
        <p>The agenda may have moved or the link may be out of date.</p>
        <Link className="button button-dark" href="/meetings">Browse meetings</Link>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="page-shell meetings-page">
        <p className="request-error" role="alert">{state.message}</p>
      </main>
    );
  }

  return <MeetingDetail meeting={state.meeting} printMode={printMode} />;
}
