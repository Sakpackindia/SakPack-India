"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { createClient } from "@/lib/supabase/client";

export default function GoogleAuthButton({ redirectTo, label }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleAuth = async () => {
    setPending(true);
    setError("");

    const supabase = createClient();
    const next = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/";
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", next);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={pending}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-gold-400/35 bg-white/95 px-5 py-3.5 text-base font-black uppercase tracking-wider text-ink shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-gold-400 hover:bg-gold-400/10 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 active:scale-98"
      >
        {pending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        ) : (
          <FcGoogle className="h-5 w-5" />
        )}
        {label}
      </button>
      {error && <p className="text-center text-base text-red-500">{error}</p>}
    </div>
  );
}
