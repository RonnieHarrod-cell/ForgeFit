"use client";

import { useState } from "react";
import { WorkoutFormData, FitnessGoal, FitnessLevel, WorkoutLocation } from "@/types/workout";
import { Zap } from "lucide-react";

interface Props {
  onSubmit: (data: WorkoutFormData) => void;
}

const goals: { value: FitnessGoal; label: string; emoji: string }[] = [
  { value: "lose_weight", label: "Lose Weight", emoji: "🔥" },
  { value: "build_muscle", label: "Build Muscle", emoji: "💪" },
  { value: "improve_endurance", label: "Endurance", emoji: "🏃" },
  { value: "general_fitness", label: "General Fitness", emoji: "⚡" },
  { value: "flexibility", label: "Flexibility", emoji: "🧘" },
];

const levels: { value: FitnessLevel; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "New to training" },
  { value: "intermediate", label: "Intermediate", desc: "6+ months" },
  { value: "advanced", label: "Advanced", desc: "2+ years" },
];

const locations: { value: WorkoutLocation; label: string; emoji: string }[] = [
  { value: "gym", label: "Gym", emoji: "🏋️" },
  { value: "home", label: "Home", emoji: "🏠" },
  { value: "outdoor", label: "Outdoor", emoji: "🌳" },
];

export default function WorkoutForm({ onSubmit }: Props) {
  const [form, setForm] = useState<WorkoutFormData>({
    goal: "build_muscle",
    level: "intermediate",
    location: "gym",
    daysPerWeek: 4,
    sessionDuration: 60,
    equipment: "",
    injuries: "",
    age: 25,
  });

  function set<K extends keyof WorkoutFormData>(key: K, value: WorkoutFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Goal */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">What's your goal?</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => set("goal", g.value)}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 sm:px-2 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                form.goal === g.value
                  ? "bg-orange-500/20 border-orange-500/60 text-orange-400"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              <span className="text-lg sm:text-xl">{g.emoji}</span>
              <span className="text-center leading-tight">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Fitness level</label>
        <div className="grid grid-cols-3 gap-2">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => set("level", l.value)}
              className={`py-3 px-3 sm:px-4 rounded-xl border text-left transition-all ${
                form.level === l.value
                  ? "bg-orange-500/20 border-orange-500/60"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`text-xs sm:text-sm font-medium ${form.level === l.value ? "text-orange-400" : "text-white/70"}`}>
                {l.label}
              </div>
              <div className="text-xs text-white/30 mt-0.5 hidden sm:block">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-white/60 mb-3">Where do you train?</label>
        <div className="grid grid-cols-3 gap-2">
          {locations.map((l) => (
            <button
              key={l.value}
              onClick={() => set("location", l.value)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                form.location === l.value
                  ? "bg-orange-500/20 border-orange-500/60 text-orange-400"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              <span>{l.emoji}</span> {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Days + Duration + Age */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Days / week</label>
          <select
            value={form.daysPerWeek}
            onChange={(e) => set("daysPerWeek", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/60"
          >
            {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} days</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Duration</label>
          <select
            value={form.sessionDuration}
            onChange={(e) => set("sessionDuration", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/60"
          >
            {[30, 45, 60, 75, 90].map((n) => <option key={n} value={n}>{n} min</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => set("age", Number(e.target.value))}
            min={13}
            max={80}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/60"
          />
        </div>
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5">
          Available equipment <span className="text-white/20">(optional)</span>
        </label>
        <input
          type="text"
          value={form.equipment}
          onChange={(e) => set("equipment", e.target.value)}
          placeholder="e.g. dumbbells, resistance bands"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-orange-500/60"
        />
      </div>

      {/* Injuries */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5">
          Injuries or limitations <span className="text-white/20">(optional)</span>
        </label>
        <input
          type="text"
          value={form.injuries}
          onChange={(e) => set("injuries", e.target.value)}
          placeholder="e.g. bad knees, lower back pain"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-orange-500/60"
        />
      </div>

      <button
        onClick={() => onSubmit(form)}
        className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Zap className="w-4 h-4" />
        Generate my plan
      </button>
    </div>
  );
}