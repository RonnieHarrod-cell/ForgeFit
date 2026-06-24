"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/firestoreService";
import { LeaderboardEntry } from "@/lib/gamification";
import { Flame, Loader2, Trophy } from "lucide-react";

interface Props {
  currentUid: string;
}

const RANK_STYLES: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "bg-amber-500/20 border-amber-500/30", text: "text-amber-400", label: "🥇" },
  2: { bg: "bg-slate-400/10 border-slate-400/20", text: "text-slate-400", label: "🥈" },
  3: { bg: "bg-orange-800/20 border-orange-700/30", text: "text-orange-600", label: "🥉" },
};

export default function Leaderboard({ currentUid }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(20).then(setEntries).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
    </div>
  );

  if (entries.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <Trophy className="w-8 h-8 text-white/20" />
      <p className="text-white/40 text-sm">No one on the board yet. Complete a workout to claim #1.</p>
    </div>
  );

  const currentRank = entries.findIndex((e) => e.uid === currentUid) + 1;

  return (
    <div className="space-y-4">
      {/* Your rank callout */}
      {currentRank > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-orange-400 font-medium">Your rank</p>
          <p className="text-orange-400 font-bold text-lg">#{currentRank}</p>
        </div>
      )}

      {/* Rankings */}
      <div className="space-y-2">
        {entries.map((entry, i) => {
          const rank = i + 1;
          const isYou = entry.uid === currentUid;
          const style = RANK_STYLES[rank];

          return (
            <div
              key={entry.uid}
              className={`rounded-2xl border px-4 sm:px-5 py-3.5 flex items-center gap-3 transition-all ${
                isYou
                  ? "bg-orange-500/10 border-orange-500/30"
                  : style
                  ? `${style.bg} border`
                  : "bg-[#1a1a1a] border-white/10"
              }`}
            >
              {/* Rank */}
              <div className="w-8 shrink-0 text-center">
                {style ? (
                  <span className="text-lg">{style.label}</span>
                ) : (
                  <span className={`text-sm font-bold ${isYou ? "text-orange-400" : "text-white/30"}`}>
                    #{rank}
                  </span>
                )}
              </div>

              {/* Name + level */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium truncate ${isYou ? "text-orange-300" : "text-white"}`}>
                    {entry.displayName}
                    {isYou && <span className="text-orange-500/60 ml-1.5 text-xs">(you)</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/30">Lv {entry.level}</span>
                  <span className="text-white/10">·</span>
                  <span className="text-xs text-white/30">{entry.totalWorkouts} workouts</span>
                </div>
              </div>

              {/* Streak */}
              {entry.streak > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs text-orange-400 font-medium">{entry.streak}d</span>
                </div>
              )}

              {/* XP */}
              <div className="shrink-0 text-right">
                <p className={`text-sm font-bold ${isYou ? "text-orange-400" : style ? style.text : "text-white/60"}`}>
                  {entry.xp.toLocaleString()}
                </p>
                <p className="text-xs text-white/20">XP</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-white/20 text-xs pt-2">
        Updated each time you complete a workout
      </p>
    </div>
  );
}