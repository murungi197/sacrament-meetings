import Link from "next/link";
import { connection } from "next/server";

export default async function Header() {
  await connection();
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(today);

  return (
    <header className="site-header">
      <div className="header-inner flex items-center justify-between">
        <Link className="brand" href="/" aria-label="Cedar Grove Ward home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span className="brand-copy">
            <span className="brand-name">Cedar Grove</span>
            <span className="brand-subtitle">Ward meetings</span>
          </span>
        </Link>
        <div className="header-right">
          <span className="today-label">{formattedDate}</span>
        </div>
      </div>
    </header>
  );
}
