import { NextRequest, NextResponse } from "next/server";
import { UserProfile } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }
    const profile: UserProfile = await req.json();

    const prompt = `You are an elite certified personal trainer and sports nutritionist with 20+ years of experience. Create a COMPREHENSIVE, DETAILED, and PROFESSIONAL fitness plan.

CLIENT PROFILE:
- Name: ${profile.name}
- Age: ${profile.age} years old
- Gender: ${profile.gender}
- Height: ${profile.height}cm
- Weight: ${profile.weight}kg
- BMI: ${(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}
- Primary Goal: ${profile.fitnessGoal.replace("_", " ").toUpperCase()}
- Current Fitness Level: ${profile.fitnessLevel}
- Training Location: ${profile.workoutLocation}
- Dietary Preference: ${profile.dietaryPreference.replace("_", " ")}
${profile.medicalHistory ? `- Medical Considerations: ${profile.medicalHistory}` : ""}
${profile.stressLevel ? `- Stress Level: ${profile.stressLevel}` : ""}

REQUIREMENTS:
1. Create a DETAILED 7-day workout plan with 4-6 exercises per day (except rest days)
2. Each exercise must include specific sets, reps, rest time, and helpful form notes
3. Exercises must be appropriate for ${profile.workoutLocation} setting
4. Progressive difficulty throughout the week
5. Include warm-up suggestions in notes
6. Diet plan must match ${profile.dietaryPreference.replace("_", " ")} preference with realistic, delicious meals
7. Provide 5 actionable, specific tips
8. Write a personalized, motivating message using the client's name
9. Create a consolidated grocery list for the week based on the diet plan

Return ONLY this JSON structure:
{
  "workoutPlan": [
    {
      "day": "Monday",
      "focus": "Upper Body Push (Chest, Shoulders, Triceps)",
      "exercises": [
        { "name": "Incline Push-ups", "sets": 3, "reps": "12-15", "restTime": "45-60s", "notes": "Hands on elevated surface, keep core engaged throughout" },
        { "name": "Standard Push-ups", "sets": 4, "reps": "10-12", "restTime": "60s", "notes": "Full range of motion, chest nearly touches floor" },
        { "name": "Diamond Push-ups", "sets": 3, "reps": "8-10", "restTime": "60s", "notes": "Hands form diamond shape, targets triceps" },
        { "name": "Pike Push-ups", "sets": 3, "reps": "8-10", "restTime": "60s", "notes": "Hips high, targets shoulders" },
        { "name": "Tricep Dips", "sets": 3, "reps": "12-15", "restTime": "45s", "notes": "Use chair or bench, keep elbows close to body" }
      ]
    },
    {
      "day": "Tuesday",
      "focus": "Lower Body (Quads, Hamstrings, Glutes)",
      "exercises": [
        { "name": "Bodyweight Squats", "sets": 4, "reps": "15-20", "restTime": "45s", "notes": "Feet shoulder-width, knees track over toes" },
        { "name": "Bulgarian Split Squats", "sets": 3, "reps": "10-12 each leg", "restTime": "60s", "notes": "Rear foot elevated, keep torso upright" },
        { "name": "Romanian Deadlifts", "sets": 3, "reps": "12-15", "restTime": "60s", "notes": "Slight knee bend, hinge at hips, feel hamstring stretch" },
        { "name": "Glute Bridges", "sets": 4, "reps": "15-20", "restTime": "45s", "notes": "Squeeze glutes at top, hold 2 seconds" },
        { "name": "Calf Raises", "sets": 3, "reps": "20-25", "restTime": "30s", "notes": "Full range of motion, pause at top" }
      ]
    },
    {
      "day": "Wednesday",
      "focus": "Active Recovery & Core",
      "exercises": [
        { "name": "Light Walking or Stretching", "sets": 1, "reps": "15-20 min", "restTime": "N/A", "notes": "Keep heart rate low, focus on mobility" },
        { "name": "Plank Hold", "sets": 3, "reps": "30-45s", "restTime": "30s", "notes": "Keep body straight, engage core" },
        { "name": "Dead Bug", "sets": 3, "reps": "10 each side", "restTime": "30s", "notes": "Lower back pressed into floor" },
        { "name": "Cat-Cow Stretch", "sets": 2, "reps": "10 cycles", "restTime": "N/A", "notes": "Slow controlled movement, breathe deeply" }
      ]
    },
    {
      "day": "Thursday",
      "focus": "Upper Body Pull (Back, Biceps, Rear Delts)",
      "exercises": [
        { "name": "Inverted Rows", "sets": 4, "reps": "10-12", "restTime": "60s", "notes": "Use table or bar, pull chest to bar" },
        { "name": "Superman Holds", "sets": 3, "reps": "12-15", "restTime": "45s", "notes": "Lift arms and legs, squeeze back muscles" },
        { "name": "Reverse Snow Angels", "sets": 3, "reps": "12-15", "restTime": "45s", "notes": "Lying face down, arms move in arc motion" },
        { "name": "Bicep Curls", "sets": 3, "reps": "12-15", "restTime": "45s", "notes": "Use water bottles or resistance band" },
        { "name": "Face Pulls with Band", "sets": 3, "reps": "15-20", "restTime": "30s", "notes": "Pull to face level, squeeze shoulder blades" }
      ]
    },
    {
      "day": "Friday",
      "focus": "Full Body HIIT",
      "exercises": [
        { "name": "Jumping Jacks", "sets": 3, "reps": "30s work", "restTime": "15s", "notes": "Warm-up, moderate pace" },
        { "name": "Burpees", "sets": 4, "reps": "8-10", "restTime": "45s", "notes": "Full extension at top, chest to floor" },
        { "name": "Mountain Climbers", "sets": 3, "reps": "30s work", "restTime": "20s", "notes": "Fast pace, keep hips low" },
        { "name": "Squat Jumps", "sets": 3, "reps": "12-15", "restTime": "45s", "notes": "Land softly, immediate next rep" },
        { "name": "High Knees", "sets": 3, "reps": "30s work", "restTime": "20s", "notes": "Drive knees high, pump arms" }
      ]
    },
    {
      "day": "Saturday",
      "focus": "Core & Flexibility",
      "exercises": [
        { "name": "Bicycle Crunches", "sets": 3, "reps": "20 total", "restTime": "30s", "notes": "Slow and controlled, elbow to opposite knee" },
        { "name": "Russian Twists", "sets": 3, "reps": "20 total", "restTime": "30s", "notes": "Feet elevated for challenge, rotate fully" },
        { "name": "Leg Raises", "sets": 3, "reps": "12-15", "restTime": "45s", "notes": "Lower back stays on floor, control the descent" },
        { "name": "Hip Flexor Stretch", "sets": 2, "reps": "30s each side", "restTime": "N/A", "notes": "Deep lunge position, push hips forward" },
        { "name": "Pigeon Pose", "sets": 2, "reps": "45s each side", "restTime": "N/A", "notes": "Great for hip mobility, breathe deeply" }
      ]
    },
    {
      "day": "Sunday",
      "focus": "Complete Rest & Recovery",
      "exercises": [
        { "name": "Rest Day", "sets": 1, "reps": "Full day", "restTime": "N/A", "notes": "Focus on sleep, hydration, and nutrition. Light walking optional." }
      ]
    }
  ],
  "dietPlan": {
    "breakfast": { "name": "Protein Oatmeal Power Bowl", "description": "Steel-cut oats with banana, almond butter, chia seeds, and a scoop of protein powder. Topped with fresh berries.", "calories": 450 },
    "lunch": { "name": "Mediterranean Chicken Bowl", "description": "Grilled chicken breast over quinoa with cucumber, tomatoes, olives, feta cheese, and tzatziki sauce.", "calories": 550 },
    "dinner": { "name": "Herb-Crusted Salmon", "description": "Baked salmon fillet with roasted sweet potato, steamed broccoli, and a side of mixed greens with olive oil dressing.", "calories": 600 },
    "snacks": [
      { "name": "Greek Yogurt Parfait", "description": "Plain Greek yogurt with honey, granola, and mixed berries", "calories": 200 },
      { "name": "Apple with Almond Butter", "description": "Sliced apple with 2 tbsp natural almond butter", "calories": 250 },
      { "name": "Protein Shake", "description": "Whey protein with banana and almond milk post-workout", "calories": 180 }
    ]
  },
  "tips": [
    "Tip 1",
    "Tip 2", 
    "Tip 3",
    "Tip 4",
    "Tip 5"
  ],
  "motivation": "Personalized message here",
  "groceryList": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}

IMPORTANT: 
- Customize ALL exercises based on ${profile.fitnessLevel} level and ${profile.workoutLocation} location
- Adjust intensity for ${profile.fitnessGoal.replace("_", " ")} goal
- Make diet ${profile.dietaryPreference.replace("_", " ")} friendly
- Write 5 specific, actionable tips for this person
- Include ${profile.name}'s name in the motivation message
- Return ONLY valid JSON, no markdown or extra text`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Fitness Coach",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter error:", error);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const plan = JSON.parse(data.choices[0].message.content || "{}");
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Error generating plan:", error?.message || error);
    return NextResponse.json(
      {
        error: "Failed to generate plan",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
