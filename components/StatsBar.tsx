"use client";

import { useEffect, useState } from "react";
import { getOrCreateStats, UserStats, xpForCurrentLevel, xpProgressPercent, ALL_BADGES } from "@/lib/gamification";
import { Flame, Star, Trophy, Zap } from "lucide-react";

interface Props {
  uid: string;
  refreshKey?: number; // increment to force re-fetch after workout
}

export default function StatsBar({ uid, refreshKey = 0 }: Props) {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    getOrCreateStats(uid).then(setStats);
  }, [uid, refreshKey]);

  if (!stats) return (
    <div className="border-b border-white/10 bg-[#111] px-4 sm:px-6 py-2.5 animate-pulse">
      <div className="max-w-4xl mx-auto h-4 bg-white/5 rounded-full w-48" />
    </div>
  );

  const progressPercent = xpProgressPercent(stats.xp);
  const xpInLevel = xpForCurrentLevel(stats.xp);
  const badgeCount = stats.badges.length;

  return (
    <div className="border-b border-white/10 bg-[#111] px-4 sm:px-6 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-5">

        {/* Level badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg px-2 py-0.5 flex items-center gap-1">
            <Star className="w-3 h-3 text-orange-400" />
            <span className="text-orange-400 text-xs font-bold">Lv {stats.level}</span>
          </div>
        </div>

        {/* XP bar */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-white/30 text-xs shrink-0 hidden sm:block">
            {xpInLevel} / 500 XP
          </span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 shrink-0">
          <Flame className={`w-3.5 h-3.5 ${stats.streak > 0 ? "text-orange-400" : "text-white/20"}`} />
          <span className={`text-xs font-medium ${stats.streak > 0 ? "text-orange-400" : "text-white/30"}`}>
            {stats.streak}d
          </span>
        </div>

        {/* Total workouts */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <Zap className="w-3.5 h-3.5 text-white/30" />
          <span className="text-xs text-white/30">{stats.totalWorkouts} workouts</span>
        </div>

        {/* Badge count */}
        {badgeCount > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <Trophy className="w-3.5 h-3.5 text-amber-400/60" />
            <span className="text-xs text-white/30">{badgeCount}/{ALL_BADGES.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}