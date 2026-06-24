"use client";

import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";

const messages = [
  "Analysing your goals...",
  "Designing your weekly split...",
  "Selecting the best exercises...",
  "Calculating sets and reps...",
  "Adding nutrition tips...",
  "Almost there...",
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      {/* Spinner */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-orange-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Dumbbell className="w-6 h-6 text-orange-500" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-white font-medium">{messages[msgIndex]}</p>
        <p className="text-white/30 text-sm mt-1">Powered by Groq · Usually takes 5–10 seconds</p>
      </div>

      {/* Skeleton cards */}
      <div className="w-full max-w-xl space-y-3 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 animate-pulse"
            style={{ opacity: 1 - i * 0.25 }}
          >
            <div className="flex justify-between items-center">
              <div className="h-3 bg-white/10 rounded-full w-32" />
              <div className="h-3 bg-orange-500/20 rounded-full w-20" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2.5 bg-white/5 rounded-full w-full" />
              <div className="h-2.5 bg-white/5 rounded-full w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}