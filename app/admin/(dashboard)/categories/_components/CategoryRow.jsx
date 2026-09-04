"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/admin/categories";

export default function CategoryRow({ category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteCategory(category.id);
      router.refresh();
    });
  };

  return (
    <tr className="group/row transition-colors duration-300 hover:bg-ink/[0.03]">
      <td className="py-4 pr-4 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gold-400/20 bg-white group-hover/row:border-gold-400/40 transition-colors duration-300">
            {category.image_url && <Image src={category.image_url} alt="" fill sizes="44px" className="object-cover transition-transform duration-500 group-hover/row:scale-[1.05]" />}
          </div>
          <span className="text-sm font-semibold text-ink group-hover/row:text-gold-700 transition-colors duration-300">{category.name}</span>
        </div>
      </td>
      <td className="py-4 pr-4 text-xs font-mono font-semibold text-ink/60">{category.slug}</td>
      <td className="py-4 pr-4">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
            category.product_count === 0
              ? "bg-red-500/15 text-red-700 border-red-500/30"
              : "bg-ink/5 text-ink/70 border-ink/15"
          }`}
        >
          {category.product_count}
        </span>
      </td>
      <td className="py-4 pr-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase border ${
          category.is_active 
            ? "bg-green-500/15 text-green-700 border-green-500/30" 
            : "bg-ink/5 text-ink/50 border-ink/15"
        }`}>
          {category.is_active ? "Active" : "Hidden"}
        </span>
      </td>
      <td className="py-4 pr-2 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link 
            href={`/admin/categories/${category.id}/edit`} 
            className="rounded-xl p-2.5 text-ink/40 hover:text-gold-600 hover:bg-gold-400/10 border border-transparent hover:border-gold-400/20 transition-all duration-300"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={pending}
            className={`rounded-xl p-2.5 border border-transparent transition-all duration-300 ${
              confirming 
                ? "text-red-400 bg-red-500/10 border-red-500/20" 
                : "text-ink/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
            }`}
            title={confirming ? "Click again to confirm" : "Delete"}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
