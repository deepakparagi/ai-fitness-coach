import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ELEVENLABS_API_KEY is not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
    });

    if (!response.ok) throw new Error("TTS failed");

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
