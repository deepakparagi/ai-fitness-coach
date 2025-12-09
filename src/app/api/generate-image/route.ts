import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();

    // Create detailed, high-quality prompts
    const imagePrompt =
      type === "exercise"
        ? `Ultra realistic photograph of a fit athletic person demonstrating ${prompt} exercise with perfect form, professional gym lighting, 8k quality, sharp focus, fitness magazine style photography, clean background`
        : `Professional food photography of ${prompt}, michelin star restaurant presentation, soft natural lighting, shallow depth of field, 8k ultra HD, appetizing colors, food magazine cover quality`;

    // Use Pollinations with better model and settings
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const seed = Math.floor(Math.random() * 1000000);
    
    // Using flux model for better quality
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&model=flux&nologo=true&seed=${seed}`;

    return NextResponse.json({
      imageUrl,
      description: `AI generated image of ${prompt}`,
    });
  } catch (error: any) {
    console.error("Image generation error:", error?.message || error);

    return NextResponse.json({
      imageUrl: null,
      error: "Failed to generate image",
    });
  }
}
