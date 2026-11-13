"use client";

import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = searchParams.get("query") ?? "";
  const searchParamsString = searchParams.toString();
  const searchParamsRef = useRef(searchParamsString);
  const pendingSearchRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParamsRef.current);
    const normalizedTerm = term.trim();

    pendingSearchRef.current = false;
    params.set("page", "1");
    if (normalizedTerm) {
      params.set("query", normalizedTerm);
    } else {
      params.delete("query");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  useEffect(() => {
    searchParamsRef.current = searchParamsString;
    if (!pendingSearchRef.current && inputRef.current) {
      inputRef.current.value = query;
    }
  }, [query, searchParamsString]);

  useEffect(() => {
    function syncInputFromLocation() {
      handleSearch.cancel();
      pendingSearchRef.current = false;
      if (inputRef.current) {
        inputRef.current.value = new URLSearchParams(window.location.search).get("query") ?? "";
      }
    }

    window.addEventListener("popstate", syncInputFromLocation);
    return () => window.removeEventListener("popstate", syncInputFromLocation);
  }, [handleSearch]);

  return (
    <input
      ref={inputRef}
      className="meeting-search-input"
      type="search"
      placeholder="Search by speaker, leader, or meeting type..."
      defaultValue={query}
      onChange={(event) => handleSearch(event.target.value)}
      aria-label="Search meetings"
    />
  );
}
