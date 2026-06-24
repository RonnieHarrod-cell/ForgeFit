"use client";

import { useState } from "react";
import { WorkoutPlanData, WorkoutFormData } from "@/types/workout";
import { savePlan } from "@/lib/firestoreService";
import { RotateCcw, ChevronDown, ChevronUp, Bookmark, CheckCircle, Loader2, CheckCheck } from "lucide-react";

interface Props {
  plan: WorkoutPlanData;
  formData: WorkoutFormData;
  uid: string;
  onReset: () => void;
  onWorkoutComplete?: () => Promise<void>;
}

export default function WorkoutPlan({ plan, formData, uid, onReset, onWorkoutComplete }: Props) {
  const [openDay, setOpenDay] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [completing, setCompleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      await savePlan(uid, plan, formData);
      setSaved(true);
    } catch {
      setSaveError("Couldn't save plan. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    if (!onWorkoutComplete) return;
    setCompleting(true);
    try {
      await onWorkoutComplete();
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{plan.title}</h2>
          <p className="text-white/50 text-sm mt-1">{plan.overview}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm border border-white/10 hover:border-white/20 px-3 py-2 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              saved
                ? "bg-green-500/20 border border-green-500/30 text-green-400"
                : "bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : saved ? <CheckCircle className="w-3.5 h-3.5" />
              : <Bookmark className="w-3.5 h-3.5" />}
            {saved ? "Saved" : saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {saveError && <p className="text-red-400 text-sm">{saveError}</p>}

      {/* Weekly Schedule */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Weekly Schedule</h3>
        {plan.weeklySchedule.map((day, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenDay(openDay === i ? -1 : i)}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-left"
            >
              <div className="min-w-0 flex-1 mr-2">
                <span className="text-white font-medium text-sm">{day.day}</span>
                <span className="text-white/30 text-sm mx-1.5">·</span>
                <span className="text-orange-400 text-sm">{day.focus}</span>
              </div>
              {openDay === i
                ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
                : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
            </button>

            {openDay === i && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 sm:space-y-5 border-t border-white/5">
                <div className="pt-4">
                  <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Warm-up</p>
                  <ul className="space-y-1">
                    {day.warmup.map((w, j) => (
                      <li key={j} className="text-sm text-white/60 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-orange-500/60 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">Exercises</p>
                  <div className="space-y-2">
                    {day.exercises.map((ex, j) => (
                      <div key={j} className="bg-white/5 rounded-xl px-3 sm:px-4 py-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white leading-snug">{ex.name}</p>
                          {ex.notes && <p className="text-xs text-white/30 mt-0.5 leading-snug">{ex.notes}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          {ex.sets && ex.reps && (
                            <p className="text-sm text-orange-400 font-medium whitespace-nowrap">{ex.sets} × {ex.reps}</p>
                          )}
                          {ex.duration && <p className="text-sm text-orange-400 font-medium">{ex.duration}</p>}
                          {ex.rest && <p className="text-xs text-white/30 mt-0.5 whitespace-nowrap">Rest {ex.rest}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Cool-down</p>
                  <ul className="space-y-1">
                    {day.cooldown.map((c, j) => (
                      <li key={j} className="text-sm text-white/60 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nutrition */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Nutrition Tips</h3>
        <ul className="space-y-2">
          {plan.nutritionTips.map((tip, i) => (
            <li key={i} className="text-sm text-white/70 flex items-start gap-2.5">
              <span className="text-orange-500 mt-0.5 shrink-0">✦</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Progression */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-medium text-orange-400/70 uppercase tracking-wider mb-2">Progression Advice</h3>
        <p className="text-sm text-white/70">{plan.progressionAdvice}</p>
      </div>

      {/* Complete workout CTA */}
      {onWorkoutComplete && (
        <button
          onClick={handleComplete}
          disabled={completing}
          className="w-full bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/40 border border-green-500/30 text-green-400 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {completing
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <CheckCheck className="w-4 h-4" />}
          {completing ? "Logging workout..." : "Mark workout as complete"}
        </button>
      )}
    </div>
  );
}