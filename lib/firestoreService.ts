import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkoutPlanData, WorkoutFormData, Exercise } from "@/types/workout";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SavedPlan {
  id: string;
  plan: WorkoutPlanData;
  formData: WorkoutFormData;
  savedAt: Timestamp;
  nickname?: string;
}

export interface HistoryEntry {
  id: string;
  planId: string;
  planTitle: string;
  dayLabel: string;
  completedAt: Timestamp;
  durationMinutes: number;
  notes?: string;
}

export interface CustomExercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  description: string;
  sets?: number;
  reps?: string;
  createdAt: Timestamp;
}

// ─── Saved Plans ──────────────────────────────────────────────────────────────

export async function savePlan(
  uid: string,
  plan: WorkoutPlanData,
  formData: WorkoutFormData,
  nickname?: string
): Promise<string> {
  const ref = collection(db, "users", uid, "plans");
  const docRef = await addDoc(ref, {
    plan,
    formData,
    nickname: nickname ?? plan.title,
    savedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSavedPlans(uid: string): Promise<SavedPlan[]> {
  const ref = collection(db, "users", uid, "plans");
  const q = query(ref, orderBy("savedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedPlan));
}

export async function getSinglePlan(uid: string, planId: string): Promise<SavedPlan | null> {
  const ref = doc(db, "users", uid, "plans", planId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as SavedPlan;
}

export async function deletePlan(uid: string, planId: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "plans", planId));
}

export async function renamePlan(uid: string, planId: string, nickname: string): Promise<void> {
  await updateDoc(doc(db, "users", uid, "plans", planId), { nickname });
}

// ─── Workout History ──────────────────────────────────────────────────────────

export async function logWorkout(
  uid: string,
  entry: Omit<HistoryEntry, "id" | "completedAt">
): Promise<string> {
  const ref = collection(db, "users", uid, "history");
  const docRef = await addDoc(ref, {
    ...entry,
    completedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getWorkoutHistory(uid: string): Promise<HistoryEntry[]> {
  const ref = collection(db, "users", uid, "history");
  const q = query(ref, orderBy("completedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HistoryEntry));
}

export async function deleteHistoryEntry(uid: string, entryId: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "history", entryId));
}

// ─── Custom Exercises ─────────────────────────────────────────────────────────

export async function addCustomExercise(
  uid: string,
  exercise: Omit<CustomExercise, "id" | "createdAt">
): Promise<string> {
  const ref = collection(db, "users", uid, "exercises");
  const docRef = await addDoc(ref, {
    ...exercise,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCustomExercises(uid: string): Promise<CustomExercise[]> {
  const ref = collection(db, "users", uid, "exercises");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomExercise));
}

export async function updateCustomExercise(
  uid: string,
  exerciseId: string,
  updates: Partial<Omit<CustomExercise, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid, "exercises", exerciseId), updates);
}

export async function deleteCustomExercise(uid: string, exerciseId: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "exercises", exerciseId));
}