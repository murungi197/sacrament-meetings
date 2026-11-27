import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { auth } from "@/auth";
import { logout } from "@/lib/actions";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<main className="page-shell meetings-page" aria-busy="true" />}>
      <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
    </Suspense>
  );
}

async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=%2Fmeetings%2Fnew");
  }

  return (
    <>
      <header className="border-b border-stone-200 bg-white">
        <nav
          className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4"
          aria-label="Leader navigation"
        >
          <span className="font-semibold text-stone-900">Ward leadership</span>
          <div className="flex items-center gap-5 text-sm">
            <Link
              className="text-green-950 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              href="/meetings/new"
            >
              Create meeting
            </Link>
            <Link
              className="text-green-950 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              href="/meetings"
            >
              Member meetings
            </Link>
            <form action={logout}>
              <button
                className="text-green-950 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}
