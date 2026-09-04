import { Users, IndianRupee, Repeat, UserPlus } from "lucide-react";
import { getAllUsers } from "@/actions/admin/users";

export const metadata = { title: "Users" };

const ROLE_STYLES = {
  admin: "border-gold-400/35 bg-gold-400/10 text-gold-600",
  customer: "border-ink/15 bg-ink/5 text-ink/60",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  const totalSpend = users.reduce((sum, u) => sum + u.totalSpend, 0);
  const repeatCount = users.filter((u) => u.orderCount > 1).length;
  const newThisMonth = users.filter((u) => {
    const created = new Date(u.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Total Spend", value: `₹${totalSpend.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Repeat Buyers", value: repeatCount, icon: Repeat },
    { label: "New This Month", value: newThisMonth, icon: UserPlus },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/20 pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">
          All <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Users</span>
        </h1>
        <p className="text-base text-ink/60 font-semibold mt-1">
          {users.length} registered user{users.length === 1 ? "" : "s"} — customers and admins.
        </p>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3.5 rounded-2xl border border-gold-400/20 bg-white/85 px-4 py-3.5 shadow-xs"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 border border-gold-400/20">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-2xl font-semibold leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-ink/60 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {users.length === 0 ? (
          <p className="py-12 text-center text-base font-semibold text-ink/50">No users yet.</p>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/20 text-xs uppercase tracking-widest text-ink/60 font-semibold">
                <th className="pb-4 font-semibold pl-2">Name</th>
                <th className="pb-4 font-semibold">Role</th>
                <th className="pb-4 font-semibold">Contact</th>
                <th className="pb-4 font-semibold">Orders</th>
                <th className="pb-4 font-semibold">Total Spend</th>
                <th className="pb-4 font-semibold pr-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors duration-300 hover:bg-ink/[0.03]">
                  <td className="py-4 pr-4 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{u.full_name || "—"}</span>
                      {u.orderCount > 1 && (
                        <span className="rounded-full border border-gold-400/35 bg-gold-400/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gold-700">
                          VIP
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-xs font-semibold text-ink/70">
                    <p>{u.email}</p>
                    {u.phone && <p className="text-ink/45">{u.phone}</p>}
                  </td>
                  <td className="py-4 pr-4 text-xs font-semibold text-ink/80">{u.orderCount}</td>
                  <td className="py-4 pr-4 text-sm font-semibold text-ink">₹{u.totalSpend.toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-2 text-xs font-semibold text-ink/50">
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {users.length === 0 ? (
          <p className="py-12 text-center text-base font-semibold text-ink/50">No users yet.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u.id} className="rounded-2xl border border-gold-400/20 bg-ink/[0.04] p-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-semibold text-ink">{u.full_name || "—"}</span>
                    {u.orderCount > 1 && (
                      <span className="shrink-0 rounded-full border border-gold-400/35 bg-gold-400/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gold-700">
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink">₹{u.totalSpend.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                    {u.role}
                  </span>
                  <p className="truncate text-xs font-semibold text-ink/60">{u.email}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-ink/50">
                  <span>{u.orderCount} order{u.orderCount === 1 ? "" : "s"}</span>
                  <span>Joined {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
