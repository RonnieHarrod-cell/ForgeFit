import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeId =
  | "first_workout"
  | "streak_7"
  | "streak_30"
  | "level_5"
  | "level_10"
  | "century";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: Timestamp;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  totalWorkouts: number;
  lastWorkoutAt: Timestamp | null;
  badges: BadgeId[];
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  totalWorkouts: number;
  updatedAt: Timestamp;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const XP_PER_WORKOUT = 100;
export const XP_STREAK_BONUS = 50;
export const XP_PER_LEVEL = 500;

export const ALL_BADGES: Omit<Badge, "unlockedAt">[] = [
  { id: "first_workout", name: "First Rep", description: "Complete your first workout", emoji: "🏁" },
  { id: "streak_7",      name: "Week Warrior", description: "Maintain a 7-day streak", emoji: "🔥" },
  { id: "streak_30",     name: "Iron Habit", description: "Maintain a 30-day streak", emoji: "⚡" },
  { id: "level_5",       name: "Rising Force", description: "Reach Level 5", emoji: "💪" },
  { id: "level_10",      name: "Elite", description: "Reach Level 10", emoji: "🏆" },
  { id: "century",       name: "Centurion", description: "Complete 100 workouts", emoji: "💯" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function xpToLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpForCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpProgressPercent(xp: number): number {
  return Math.round((xpForCurrentLevel(xp) / XP_PER_LEVEL) * 100);
}

function isConsecutiveDay(last: Timestamp | null): boolean {
  if (!last) return false;
  const lastDate = last.toDate();
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours < 48; // within 48h = streak continues
}

function isSameDay(last: Timestamp | null): boolean {
  if (!last) return false;
  const lastDate = last.toDate();
  const now = new Date();
  return (
    lastDate.getFullYear() === now.getFullYear() &&
    lastDate.getMonth() === now.getMonth() &&
    lastDate.getDate() === now.getDate()
  );
}

function checkNewBadges(stats: UserStats): BadgeId[] {
  const earned = new Set(stats.badges);
  const newBadges: BadgeId[] = [];

  if (!earned.has("first_workout") && stats.totalWorkouts >= 1) newBadges.push("first_workout");
  if (!earned.has("streak_7") && stats.streak >= 7) newBadges.push("streak_7");
  if (!earned.has("streak_30") && stats.streak >= 30) newBadges.push("streak_30");
  if (!earned.has("level_5") && stats.level >= 5) newBadges.push("level_5");
  if (!earned.has("level_10") && stats.level >= 10) newBadges.push("level_10");
  if (!earned.has("century") && stats.totalWorkouts >= 100) newBadges.push("century");

  return newBadges;
}

// ─── Firestore ops ────────────────────────────────────────────────────────────

export async function getOrCreateStats(uid: string): Promise<UserStats> {
  const ref = doc(db, "users", uid, "stats", "data");
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as UserStats;

  const initial: UserStats = {
    xp: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    totalWorkouts: 0,
    lastWorkoutAt: null,
    badges: [],
  };
  await setDoc(ref, initial);
  return initial;
}

export interface WorkoutReward {
  xpGained: number;
  streakBonus: boolean;
  newLevel: number | null; // non-null if levelled up
  newBadges: BadgeId[];
  newStreak: number;
}

export async function recordWorkoutComplete(
  uid: string,
  displayName: string
): Promise<WorkoutReward> {
  const ref = doc(db, "users", uid, "stats", "data");
  const stats = await getOrCreateStats(uid);

  // Streak logic
  const alreadyDoneToday = isSameDay(stats.lastWorkoutAt);
  const streakContinues = isConsecutiveDay(stats.lastWorkoutAt);
  const newStreak = alreadyDoneToday
    ? stats.streak
    : streakContinues
    ? stats.streak + 1
    : 1;

  const streakBonus = !alreadyDoneToday && streakContinues;
  const xpGained = alreadyDoneToday ? 0 : XP_PER_WORKOUT + (streakBonus ? XP_STREAK_BONUS : 0);
  const newXp = stats.xp + xpGained;
  const oldLevel = stats.level;
  const newLevel = xpToLevel(newXp);
  const levelledUp = newLevel > oldLevel;
  const newTotalWorkouts = alreadyDoneToday ? stats.totalWorkouts : stats.totalWorkouts + 1;

  const updatedStats: UserStats = {
    xp: newXp,
    level: newLevel,
    streak: newStreak,
    bestStreak: Math.max(stats.bestStreak, newStreak),
    totalWorkouts: newTotalWorkouts,
    lastWorkoutAt: Timestamp.now(),
    badges: stats.badges,
  };

  const newBadges = checkNewBadges(updatedStats);
  updatedStats.badges = [...stats.badges, ...newBadges];

  await setDoc(ref, updatedStats);

  // Update public leaderboard doc
  await setDoc(doc(db, "leaderboard", uid), {
    uid,
    displayName,
    xp: newXp,
    level: newLevel,
    streak: newStreak,
    totalWorkouts: newTotalWorkouts,
    updatedAt: serverTimestamp(),
  });

  return {
    xpGained,
    streakBonus,
    newLevel: levelledUp ? newLevel : null,
    newBadges,
    newStreak,
  };
}