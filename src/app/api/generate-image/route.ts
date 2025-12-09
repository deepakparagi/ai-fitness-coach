import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Quality enhancement suffix for all images
const qualityEnhancement = "4K quality, photorealistic rendering, high dynamic range, sharp textures, accurate lighting, natural shadows, realistic proportions, professionally shot, visually polished, no blur, no noise, no distortion, no artifacts";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();

    // Create ultra-detailed prompts for high-quality realistic images
    let imagePrompt: string;
    
    if (type === "exercise") {
      imagePrompt = `Ultra high-resolution photograph of a fit athletic person performing ${prompt} exercise with perfect anatomical form. Professional fitness studio with modern equipment, three-point studio lighting with soft key light, natural skin texture with realistic pores and sweat, accurate muscle definition, proper body mechanics and posture. Shot on professional DSLR camera, 85mm portrait lens, f/2.8 aperture, ${qualityEnhancement}`;
    } else {
      imagePrompt = `Ultra high-resolution professional food photography of ${prompt}. Michelin star restaurant presentation on elegant white ceramic plate, fresh vibrant ingredients, steam rising naturally, glistening sauce, garnished with microgreens. Natural window lighting with soft diffusion, 45-degree hero angle, shallow depth of field with creamy bokeh, ${qualityEnhancement}`;
    }

    // Use Pollinations with flux model at higher resolution
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const seed = Math.floor(Math.random() * 1000000);
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

    return NextResponse.json({
      imageUrl,
      description: `AI generated ultra HD image of ${prompt}`,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Image generation error:", errorMessage);

    return NextResponse.json({
      imageUrl: null,
      error: "Failed to generate image",
    });
  }
}
