import { Mail, Users, CalendarClock } from "lucide-react";
import { getNewsletterSubscribers } from "@/actions/admin/newsletter";
import NewsletterList from "./_components/NewsletterList";

export const metadata = { title: "Newsletter" };

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = subscribers.filter((s) => new Date(s.created_at) >= today).length;

  const stats = [
    { label: "Total Subscribers", value: subscribers.length, icon: Users },
    { label: "Joined Today", value: todayCount, icon: CalendarClock },
  ];

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/20 pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Newsletter <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Subscribers</span>
        </h1>
        <p className="text-base text-ink/60 font-semibold mt-1">Everyone who signed up through the "Stay Updated" bar at the top of the footer.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3.5 rounded-2xl border border-gold-400/20 bg-white/85 px-4 py-3.5 shadow-xs"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-ink/60 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <NewsletterList subscribers={subscribers} />
    </div>
  );
}
