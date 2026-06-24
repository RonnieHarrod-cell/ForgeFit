import Groq from "groq-sdk";
import { WorkoutFormData, WorkoutPlanData } from "@/types/workout";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateWorkoutPlan(data: WorkoutFormData): Promise<WorkoutPlanData> {
  const goalLabels: Record<string, string> = {
    lose_weight: "lose weight and burn fat",
    build_muscle: "build muscle and increase strength",
    improve_endurance: "improve cardiovascular endurance",
    general_fitness: "improve overall fitness",
    flexibility: "improve flexibility and mobility",
  };

  const prompt = `You are an expert personal trainer. Create a detailed, personalised ${data.daysPerWeek}-day workout plan for the following client:

- Goal: ${goalLabels[data.goal]}
- Fitness Level: ${data.level}
- Location: ${data.location}
- Session Duration: ${data.sessionDuration} minutes
- Available Equipment: ${data.equipment || "None specified"}
- Injuries/Limitations: ${data.injuries || "None"}
- Age: ${data.age}

Respond ONLY with a valid JSON object. No markdown, no explanation, just raw JSON.

JSON structure:
{
  "title": "string — a punchy plan name",
  "overview": "string — 2-3 sentence summary of the approach",
  "weeklySchedule": [
    {
      "day": "Day 1 — Monday",
      "focus": "string — e.g. Upper Body Strength",
      "warmup": ["exercise 1", "exercise 2"],
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": "string e.g. 8-12",
          "rest": "string e.g. 60 seconds",
          "notes": "string — optional form tip"
        }
      ],
      "cooldown": ["stretch 1", "stretch 2"]
    }
  ],
  "nutritionTips": ["tip 1", "tip 2", "tip 3"],
  "progressionAdvice": "string — how to progress over 4-8 weeks"
}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(clean) as WorkoutPlanData;
}

export default groq;