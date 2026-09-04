"use client";

import { useActionState } from "react";
import { UserCog, Check, AlertCircle } from "lucide-react";
import { updateAdminProfile } from "@/actions/admin/profile";

const inputClass =
  "w-full rounded-xl border border-gold-400/20 bg-ivory-deep/60 px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60";

export default function ProfileForm({ profile }) {
  const [state, formAction, pending] = useActionState(updateAdminProfile, {});
  const initial = (profile?.full_name || "A").trim().charAt(0).toUpperCase();

  return (
    <form
      action={formAction}
      className="max-w-md space-y-5 rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md md:p-8"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-lg font-semibold text-ink shadow-gold">
          {initial}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink">{profile?.full_name || "Admin"}</p>
          <p className="flex items-center gap-1 text-base font-semibold text-ink/40">
            <UserCog className="h-3.5 w-3.5" /> Administrator
          </p>
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-base font-semibold text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2.5 text-base font-semibold text-green-600">
          <Check className="h-4 w-4 shrink-0" /> Profile updated.
        </div>
      )}

      <div>
        <label className={labelClass}>Full Name</label>
        <input required name="full_name" defaultValue={profile?.full_name} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input disabled value={profile?.email || ""} className={`${inputClass} opacity-50`} />
      </div>
      <div>
        <label className={labelClass}>New Password (optional)</label>
        <input type="password" name="new_password" placeholder="Leave blank to keep current password" className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="btn-gold w-full text-base font-semibold disabled:opacity-60">
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
