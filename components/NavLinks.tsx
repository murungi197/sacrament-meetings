"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/meetings", label: "All meetings" },
  { href: "/meetings/current", label: "This Sunday" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="main-nav flex items-center" aria-label="Main navigation">
      {links.map(({ href, label }) => {
        const isActive =
          href === "/meetings"
            ? pathname === "/meetings" || /^\/meetings\/\d+$/.test(pathname)
            : pathname === "/meetings/current";

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`nav-link${isActive ? " is-active" : ""}`}
            href={href}
            key={href}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
