"use client";

import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import WorkoutForm from "@/components/WorkoutForm";
import { Dumbbell, LogOut, User } from "lucide-react";
import { useState } from "react";
import { WorkoutPlanData, WorkoutFormData } from "@/types/workout";
import WorkoutPlan from "@/components/WorkoutPlan";
import LoadingState from "@/components/LoadingState";

export default function Page() {
  const { user, loading, logout } = useAuth();
  const [plan, setPlan] = useState<WorkoutPlanData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  if (loading) return <div className="min-h-screen bg-[#0d0d0d]" />;
  if (!user) return <AuthForm />;

  async function handleGenerate(formData: WorkoutFormData) {
    setGenerating(true);
    setError("");
    setPlan(null);
    try {
      const res = await fetch("/api/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate plan.");
      setPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Navbar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">ForgeFit</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <User className="w-4 h-4" />
            <span>{user.displayName ?? user.email}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {!generating && !plan && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Build your plan</h1>
            <p className="text-white/40">Tell us about yourself and we'll generate a personalised workout plan.</p>
          </div>
        )}

        {!generating && !plan && (
          <WorkoutForm onSubmit={handleGenerate} />
        )}

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {generating && <LoadingState />}

        {plan && !generating && (
          <WorkoutPlan
            plan={plan}
            uid={user.uid}
            onReset={() => setPlan(null)}
          />
        )}
      </main>
    </div>
  );
}