"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Trash2, Copy, Check } from "lucide-react";
import { deleteNewsletterSubscriber } from "@/actions/admin/newsletter";

export default function NewsletterList({ subscribers }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDelete = (id) => {
    if (!confirm("Remove this subscriber?")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteNewsletterSubscriber(id);
      setDeletingId(null);
      router.refresh();
    });
  };

  const handleCopyAll = () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (subscribers.length === 0) {
    return (
      <p className="rounded-[2rem] border border-gold-400/20 bg-white/85 py-12 text-center text-base font-semibold text-ink/50 backdrop-blur-md">
        No subscribers yet.
      </p>
    );
  }

  return (
    <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-5 backdrop-blur-md sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-base font-semibold text-ink/60">{subscribers.length} email{subscribers.length !== 1 ? "s" : ""}</p>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-sm font-semibold text-gold-700 transition-colors hover:bg-gold-400/20"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy All Emails"}
        </button>
      </div>

      <ul className="divide-y divide-gold-400/15">
        {subscribers.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-600 border border-gold-400/20">
                <Mail className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-ink">{s.email}</p>
                <p className="text-xs font-semibold text-ink/40">
                  {new Date(s.created_at).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(s.id)}
              disabled={pending && deletingId === s.id}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400/70 transition-colors hover:bg-red-400/10 hover:text-red-500 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
