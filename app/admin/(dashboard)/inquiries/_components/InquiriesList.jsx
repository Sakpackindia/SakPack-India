"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { resolveInquiry } from "@/actions/admin/inquiries";

const TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "resolved", label: "Resolved" },
];

export default function InquiriesList({ inquiries }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("all");

  const toggle = (id, current) => {
    startTransition(async () => {
      await resolveInquiry(id, !current);
      router.refresh();
    });
  };

  const filtered = inquiries.filter((inq) => {
    if (tab === "new") return !inq.is_resolved;
    if (tab === "resolved") return inq.is_resolved;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-300 ${
              tab === t.key
                ? "border-gold-400/40 bg-gold-400/10 text-gold-700 font-semibold"
                : "border-gold-400/20 text-ink/60 font-semibold hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[2rem] border border-gold-400/20 bg-white/85 py-12 text-center text-base font-semibold text-ink/50 backdrop-blur-md">
          No inquiries here.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((inq) => (
            <li
              key={inq.id}
              className="rounded-2xl border border-gold-400/20 bg-white/85 p-5 backdrop-blur-md shadow-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="font-display text-lg font-semibold text-ink">{inq.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        inq.is_resolved
                          ? "bg-green-400/15 text-green-700 border-green-400/30"
                          : "bg-gold-400/15 text-gold-800 border-gold-400/40"
                      }`}
                    >
                      {inq.is_resolved ? "Resolved" : "New"}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-3.5 text-sm font-semibold text-ink/60">
                    {inq.email && (
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Mail className="h-4 w-4 text-gold-600" /> {inq.email}
                      </span>
                    )}
                    {inq.phone && (
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Phone className="h-4 w-4 text-gold-600" /> {inq.phone}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-base font-semibold text-ink/80 leading-relaxed">{inq.message}</p>
                  <p className="mt-2.5 text-xs font-semibold text-ink/40">
                    {new Date(inq.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => toggle(inq.id, inq.is_resolved)}
                  disabled={pending}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                    inq.is_resolved
                      ? "border-gold-400/30 text-ink/70 font-semibold hover:text-gold-700 hover:border-gold-400/50"
                      : "border-green-500/30 bg-green-500/15 text-green-700 font-semibold hover:bg-green-500/25"
                  }`}
                >
                  Mark {inq.is_resolved ? "Unresolved" : "Resolved"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
