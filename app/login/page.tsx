import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import LoginForm from "@/components/LoginForm";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Leader sign in",
  description: "Sign in to manage Cedar Grove Ward meeting agendas.",
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={<main className="page-shell meetings-page" aria-busy="true" />}>
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
  await connection();
  const session = await auth();
  if (session?.user) redirect("/meetings/new");

  const params = await searchParams;
  const callbackUrl = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;

  return (
    <main className="page-shell meetings-page">
      <section className="mx-auto max-w-lg rounded border border-stone-200 bg-white p-8">
        <span className="eyebrow">Ward leadership</span>
        <h1 className="mt-3 font-serif text-4xl text-stone-900">Sign in</h1>
        <p className="mt-3 text-stone-700">
          Sign in to create and update meeting agendas.
        </p>
        <LoginForm callbackUrl={callbackUrl} />
      </section>
    </main>
  );
}
