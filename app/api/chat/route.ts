import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages,
      temperature: 0.7,
      stream: false
    }),
  });

  const json = await groqRes.json();

  const fullText = json.choices?.[0]?.message?.content ?? "No response";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Split text into words so we can fake streaming
      const words = fullText.split(" ");

      for (let word of words) {
        const chunk = {
          choices: [
            {
              delta: { content: word + " " }
            }
          ]
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      }

      // Send done message
      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
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
