import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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", // replace this
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages,
      temperature: 0.7,
      stream: false // 👈 we set stream to false so we get full response
    }),
  });

  const json = await groqRes.json();

  // Groq returns full response. Morphic expects a stream.
  // So we simulate a stream by turning it into a fake stream-like format.
  const reply = json.choices?.[0]?.message?.content ?? "No response";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: reply })}\n\n`));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    }
  });
}
