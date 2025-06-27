import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userMessage = body.message;

  console.log("🔍 Received message:", userMessage);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a general-purpose AI acting as an Insight Analyst. Analyze all the data provided by the user and deliver a clear, concise summary. Identify and explain five key objectives based on the user’s data. Each point should focus on a distinct goal or motivation reflected in the information. Write in a professional, informative tone, as if you are a neutral and intelligent assistant.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      model:"llama-3.1-8b-instant", 
    });

    console.log("✅ Groq response:", JSON.stringify(chatCompletion, null, 2));

    return NextResponse.json({
      response: chatCompletion.choices?.[0]?.message?.content ?? "No message returned.",
    });
  } catch (err) {
    console.error("❌ Groq error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Groq completion" },
      { status: 500 }
    );
  }
}
