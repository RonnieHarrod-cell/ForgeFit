"use client";

import { useEffect, useState } from "react";
import { getOrCreateStats, UserStats, ALL_BADGES, BadgeId } from "@/lib/gamification";
import { Lock } from "lucide-react";

interface Props {
  uid: string;
  refreshKey?: number;
}

export default function Badges({ uid, refreshKey = 0 }: Props) {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    getOrCreateStats(uid).then(setStats);
  }, [uid, refreshKey]);

  if (!stats) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {ALL_BADGES.map((_, i) => (
        <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 animate-pulse h-24" />
      ))}
    </div>
  );

  const earned = new Set<BadgeId>(stats.badges);

  return (
    <div className="space-y-4">
      {/* Earned count */}
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">
          <span className="text-white font-medium">{earned.size}</span> of {ALL_BADGES.length} unlocked
        </p>
        {earned.size === ALL_BADGES.length && (
          <span className="text-xs bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full">
            🏆 Full set!
          </span>
        )}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALL_BADGES.map((badge) => {
          const isEarned = earned.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`relative rounded-2xl border p-4 transition-all ${
                isEarned
                  ? "bg-[#1a1a1a] border-white/10"
                  : "bg-[#141414] border-white/5 opacity-50"
              }`}
            >
              {/* Earned glow */}
              {isEarned && (
                <div className="absolute inset-0 rounded-2xl bg-orange-500/5 pointer-events-none" />
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-2xl ${isEarned ? "" : "grayscale"}`}>
                    {badge.emoji}
                  </span>
                  {!isEarned && (
                    <Lock className="w-3.5 h-3.5 text-white/20 shrink-0 mt-0.5" />
                  )}
                  {isEarned && (
                    <span className="text-xs bg-green-500/20 border border-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full leading-none">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium leading-tight ${isEarned ? "text-white" : "text-white/40"}`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}