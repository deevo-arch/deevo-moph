import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const groqStream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages,
      temperature: 0.7,
      stream: true
    }),
  });

  return new Response(groqStream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  });
}
