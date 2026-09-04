"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/actions/contact";

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, {});

  if (state.success) {
    return <p className="text-sm font-bold text-gold-600">Thanks for subscribing!</p>;
  }

  return (
    <form action={formAction} className="relative flex w-full max-w-md items-center rounded-full bg-white p-1 border border-gold-400/80 shadow-md">
      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="w-full flex-1 rounded-full bg-transparent px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-ink placeholder:text-ink/40 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-[#caa14b] px-5 sm:px-7 py-2 sm:py-2.5 text-sm font-extrabold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#b3893a] disabled:opacity-60 shadow-sm"
      >
        {pending ? "..." : "SUBSCRIBE"}
      </button>
      {state.error && <p className="absolute -bottom-5 left-4 text-xs text-red-500 font-semibold">{state.error}</p>}
    </form>
  );
}


