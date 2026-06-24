import { NextRequest, NextResponse } from "next/server";
import { generateWorkoutPlan } from "@/lib/groq";
import { WorkoutFormData } from "@/types/workout";

export async function POST(req: NextRequest) {
  try {
    const body: WorkoutFormData = await req.json();

    // Basic validation
    const required: (keyof WorkoutFormData)[] = ["goal", "level", "location", "daysPerWeek", "sessionDuration", "age"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === "") {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    if (body.daysPerWeek < 1 || body.daysPerWeek > 7) {
      return NextResponse.json({ error: "daysPerWeek must be between 1 and 7." }, { status: 400 });
    }

    const plan = await generateWorkoutPlan(body);
    return NextResponse.json({ plan }, { status: 200 });
  } catch (err: any) {
    console.error("[generate-workout]", err);
    return NextResponse.json(
      { error: "Failed to generate workout plan. Please try again." },
      { status: 500 }
    );
  }
}