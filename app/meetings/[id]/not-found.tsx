import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <main className="page-shell not-found-page">
      <span className="eyebrow">Cedar Grove Ward</span>
      <h1>We couldn&apos;t find that meeting.</h1>
      <p>The agenda may have moved or the link may be out of date.</p>
      <Link className="button button-dark" href="/meetings">Browse meetings</Link>
    </main>
  );
}
