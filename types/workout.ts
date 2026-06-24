export type FitnessGoal = "lose_weight" | "build_muscle" | "improve_endurance" | "general_fitness" | "flexibility";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type WorkoutLocation = "gym" | "home" | "outdoor";

export interface WorkoutFormData {
  goal: FitnessGoal;
  level: FitnessLevel;
  location: WorkoutLocation;
  daysPerWeek: number;
  sessionDuration: number; // minutes
  equipment: string;
  injuries: string;
  age: number;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  rest?: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export interface WorkoutPlanData {
  title: string;
  overview: string;
  weeklySchedule: WorkoutDay[];
  nutritionTips: string[];
  progressionAdvice: string;
}