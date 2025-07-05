import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",  // 🔑 Replace this
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages,
      temperature: 0.7
    })
  });

  const j = await resp.json();
  return NextResponse.json(j);
}
