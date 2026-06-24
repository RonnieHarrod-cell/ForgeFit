"use client";

import { useEffect, useState } from "react";
import { getSavedPlans, deletePlan, SavedPlan } from "@/lib/firestoreService";
import { Trash2, ChevronRight, Loader2, BookOpen } from "lucide-react";
import { WorkoutPlanData } from "@/types/workout";

interface Props {
  uid: string;
  onLoad: (plan: WorkoutPlanData) => void;
}

export default function SavedPlans({ uid, onLoad }: Props) {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setLoading(true);
    try {
      const data = await getSavedPlans(uid);
      setPlans(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e: React.MouseEvent, planId: string) {
    e.stopPropagation();
    setDeleting(planId);
    try {
      await deletePlan(uid, planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
        <BookOpen className="w-8 h-8 text-white/20" />
        <p className="text-white/40 text-sm">No saved plans yet. Generate one and hit Save.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plans.map((p) => (
        <div
          key={p.id}
          onClick={() => onLoad(p.plan)}
          className="bg-[#1a1a1a] border border-white/10 active:border-white/30 hover:border-white/20 rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-3 cursor-pointer transition-all group"
        >
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{p.nickname ?? p.plan.title}</p>
            <p className="text-white/30 text-xs mt-0.5">
              {p.savedAt?.toDate?.().toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              }) ?? "Saved"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => handleDelete(e, p.id)}
              disabled={deleting === p.id}
              className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-all"
            >
              {deleting === p.id
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Trash2 className="w-3.5 h-3.5" />}
            </button>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
}