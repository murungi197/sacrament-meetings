"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedPage = Number(searchParams.get("page")) || 1;
  const currentPage = Number.isSafeInteger(parsedPage) && parsedPage > 0
    ? parsedPage
    : 1;

  if (totalPages === 0) return null;

  function createPageURL(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-4 text-sm"
      aria-label="Pagination"
    >
      {currentPage > 1 && (
        <Link
          className="rounded-full border border-stone-300 px-4 py-2 text-green-950 transition-colors hover:bg-green-950 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
          href={createPageURL(currentPage - 1)}
        >
          Previous
        </Link>
      )}
      <span className="text-stone-700" aria-current="page">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          className="rounded-full border border-stone-300 px-4 py-2 text-green-950 transition-colors hover:bg-green-950 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
          href={createPageURL(currentPage + 1)}
        >
          Next
        </Link>
      )}
    </nav>
  );
}
