"use client";

import { useActionState } from "react";

import { login } from "@/lib/actions";

const initialState: { error?: string } = {};

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      {state.error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-900" role="alert">
          {state.error}
        </p>
      )}
      <div>
        <label className="font-medium text-stone-900" htmlFor="email">Email</label>
        <input
          autoComplete="username"
          className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label className="font-medium text-stone-900" htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          className="mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      <button className="button button-dark" disabled={isPending} type="submit">
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
