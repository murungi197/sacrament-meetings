import Link from "next/link";

export default function EditMeetingNotFound() {
  return (
    <main className="page-shell not-found-page">
      <span className="eyebrow">Ward leadership</span>
      <h1>Meeting not found</h1>
      <p>The meeting may have been deleted or the link may be incorrect.</p>
      <Link className="button button-dark" href="/meetings">Back to meetings</Link>
    </main>
  );
}
