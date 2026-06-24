"use client";

import { WorkoutReward, ALL_BADGES } from "@/lib/gamification";
import { X, Flame, Star, Zap } from "lucide-react";

interface Props {
  reward: WorkoutReward;
  onClose: () => void;
}

export default function WorkoutComplete({ reward, onClose }: Props) {
  const { xpGained, streakBonus, newLevel, newBadges, newStreak } = reward;
  const alreadyLogged = xpGained === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {alreadyLogged ? (
          <>
            <div className="text-3xl mb-3">✅</div>
            <h2 className="text-white font-bold text-lg mb-1">Already logged today</h2>
            <p className="text-white/40 text-sm">Come back tomorrow to keep your streak alive.</p>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="text-3xl mb-3">{newLevel ? "🎉" : "💪"}</div>
            <h2 className="text-white font-bold text-lg mb-1">
              {newLevel ? `Level ${newLevel} unlocked!` : "Workout logged!"}
            </h2>
            <p className="text-white/40 text-sm mb-5">
              {newLevel
                ? `You've hit Level ${newLevel}. Keep pushing.`
                : "Great work. Every rep counts."}
            </p>

            {/* Rewards */}
            <div className="space-y-2.5">
              {/* XP */}
              <div className="flex items-center justify-between bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-white/70">XP earned</span>
                </div>
                <span className="text-orange-400 font-bold">+{xpGained}</span>
              </div>

              {/* Streak bonus */}
              {streakBonus && (
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-white/70">Streak bonus</span>
                  </div>
                  <span className="text-amber-400 font-bold">+50 XP</span>
                </div>
              )}

              {/* Streak count */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/70">Current streak</span>
                </div>
                <span className="text-white font-bold">{newStreak} day{newStreak !== 1 ? "s" : ""}</span>
              </div>

              {/* New badges */}
              {newBadges.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-white/70">New badge{newBadges.length > 1 ? "s" : ""} unlocked</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newBadges.map((id) => {
                      const badge = ALL_BADGES.find((b) => b.id === id);
                      if (!badge) return null;
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5"
                        >
                          <span className="text-base">{badge.emoji}</span>
                          <span className="text-xs text-amber-400 font-medium">{badge.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {alreadyLogged ? "Got it" : "Keep going 🔥"}
        </button>
      </div>
    </div>
  );
}