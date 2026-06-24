"use client";

import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import WorkoutForm from "@/components/WorkoutForm";
import WorkoutPlan from "@/components/WorkoutPlan";
import LoadingState from "@/components/LoadingState";
import SavedPlans from "@/components/SavedPlans";
import StatsBar from "@/components/StatsBar";
import Leaderboard from "@/components/Leaderboard";
import Badges from "@/components/Badges";
import WorkoutComplete from "@/components/WorkoutComplete";
import { Dumbbell, LogOut, Zap, BookOpen, Trophy, Shield } from "lucide-react";
import { useState } from "react";
import { WorkoutPlanData, WorkoutFormData } from "@/types/workout";
import { recordWorkoutComplete, WorkoutReward } from "@/lib/gamification";

type Tab = "generate" | "saved" | "leaderboard" | "badges";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "generate",    label: "Generate",    icon: Zap },
  { key: "saved",       label: "Saved",       icon: BookOpen },
  { key: "leaderboard", label: "Rankings",    icon: Trophy },
  { key: "badges",      label: "Badges",      icon: Shield },
];

export default function Page() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("generate");
  const [plan, setPlan] = useState<WorkoutPlanData | null>(null);
  const [formData, setFormData] = useState<WorkoutFormData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [reward, setReward] = useState<WorkoutReward | null>(null);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  if (loading) return <div className="min-h-screen bg-[#0d0d0d]" />;
  if (!user) return <AuthForm />;

  async function handleGenerate(data: WorkoutFormData) {
    setFormData(data);
    setGenerating(true);
    setError("");
    setPlan(null);
    try {
      const res = await fetch("/api/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to generate plan.");
      setPlan(json.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleWorkoutComplete() {
    const result = await recordWorkoutComplete(
      user!.uid,
      user!.displayName ?? user!.email ?? "Unknown"
    );
    setReward(result);
    setStatsRefreshKey((k) => k + 1);
  }

  function handleLoadSaved(savedPlan: WorkoutPlanData) {
    setPlan(savedPlan);
    setTab("generate");
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Navbar */}
      <header className="border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight">ForgeFit</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-white/40 text-sm truncate max-w-[160px]">
            {user.displayName ?? user.email}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <StatsBar uid={user.uid} refreshKey={statsRefreshKey} />

      {/* Tabs — scrollable on mobile */}
      <div className="border-b border-white/10 px-4 sm:px-6 overflow-x-auto">
        <div className="flex min-w-max sm:min-w-0 max-w-4xl mx-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); if (key === "generate") setPlan(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                tab === key
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-white/40 hover:text-white/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Generate tab */}
        {tab === "generate" && (
          <>
            {!generating && !plan && (
              <>
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1.5">Build your plan</h1>
                  <p className="text-white/40 text-sm sm:text-base">
                    Tell us about yourself and we'll generate a personalised workout plan.
                  </p>
                </div>
                <WorkoutForm onSubmit={handleGenerate} />
              </>
            )}
            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            {generating && <LoadingState />}
            {plan && !generating && (
              <WorkoutPlan
                plan={plan}
                formData={formData!}
                uid={user.uid}
                onReset={() => setPlan(null)}
                onWorkoutComplete={handleWorkoutComplete}
              />
            )}
          </>
        )}

        {/* Saved tab */}
        {tab === "saved" && (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1.5">Saved Plans</h1>
              <p className="text-white/40 text-sm sm:text-base">Tap any plan to load it back up.</p>
            </div>
            <SavedPlans uid={user.uid} onLoad={handleLoadSaved} />
          </>
        )}

        {/* Leaderboard tab */}
        {tab === "leaderboard" && (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1.5">Rankings</h1>
              <p className="text-white/40 text-sm sm:text-base">Top athletes by XP. Complete workouts to climb.</p>
            </div>
            <Leaderboard currentUid={user.uid} />
          </>
        )}

        {/* Badges tab */}
        {tab === "badges" && (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1.5">Badges</h1>
              <p className="text-white/40 text-sm sm:text-base">Unlock achievements by training consistently.</p>
            </div>
            <Badges uid={user.uid} refreshKey={statsRefreshKey} />
          </>
        )}
      </main>

      {/* Reward modal */}
      {reward && (
        <WorkoutComplete
          reward={reward}
          onClose={() => setReward(null)}
        />
      )}
    </div>
  );
}