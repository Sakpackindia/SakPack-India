import Link from "next/link";
import { Plus, FolderTree, CheckCircle2, EyeOff, PackageX } from "lucide-react";
import { getAllCategoriesAdmin } from "@/actions/admin/categories";
import CategoryRow from "./_components/CategoryRow";
import CategoryCard from "./_components/CategoryCard";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  const activeCount = categories.filter((c) => c.is_active).length;
  const emptyCount = categories.filter((c) => c.product_count === 0).length;

  const stats = [
    { label: "Total Categories", value: categories.length, icon: FolderTree },
    { label: "Active", value: activeCount, icon: CheckCircle2 },
    { label: "Hidden", value: categories.length - activeCount, icon: EyeOff },
    { label: "Empty", value: emptyCount, icon: PackageX },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-400/20 pb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Store <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Categories</span>
          </h1>
          <p className="text-base text-ink/60 font-semibold mt-1">Organize products by type or collection.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="btn-gold group flex w-full items-center justify-center gap-1.5 px-6 py-3.5 text-sm font-semibold tracking-widest uppercase shadow-[0_4px_15px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_20px_rgba(212,163,89,0.25)] hover:-translate-y-0.5 transition-all duration-300 sm:w-auto"
        >
          <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> New Category
        </Link>
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
              <p className="font-display text-2xl font-semibold leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-ink/60 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Container (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/20 bg-white/85 p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {categories.length === 0 ? (
          <p className="py-12 text-center text-base font-semibold text-ink/50">No categories yet — create your first one.</p>
        ) : (
          <table className="w-full min-w-[560px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/20 text-xs uppercase tracking-widest text-ink/60 font-semibold">
                <th className="pb-4 font-semibold pl-2">Name</th>
                <th className="pb-4 font-semibold">Slug</th>
                <th className="pb-4 font-semibold">Products</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {categories.map((cat) => (
                <CategoryRow key={cat.id} category={cat} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/20 bg-white/85 p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {categories.length === 0 ? (
          <p className="py-12 text-center text-base text-ink/40">No categories yet — create your first one.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
