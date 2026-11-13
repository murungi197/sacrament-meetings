import { Suspense } from "react";
import Link from "next/link";

import NavLinks from "@/components/NavLinks";

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="section-navigation">
        <div className="section-navigation-inner">
          <span className="section-name">Meetings</span>
          <Suspense fallback={<nav className="main-nav" aria-label="Main navigation" />}>
            <NavLinks />
          </Suspense>
          <Link className="section-home-link" href="/">Ward home</Link>
        </div>
      </div>
      {children}
    </>
  );
}
