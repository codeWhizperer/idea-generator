// import { Cencori } from 'cencori';  
// import { IDEA_GENERATOR_SYSTEM_PROMPT } from '@/lib/prompt';
// export async function POST(req: Request) {
//     const { messages } = await req.json();
  
//     const cencori = new Cencori({
//       apiKey: process.env.NEXT_PUBLIC_CENCORI_API_KEY!,
//     });
  
//     const stream = cencori.ai.chatStream({
//       model: 'gpt-4o',
//       messages: [
//         {
//           role: 'system',
//           content: IDEA_GENERATOR_SYSTEM_PROMPT,
//         },
//         ...messages, // user messages from frontend
//       ],
//     });
  
//     const encoder = new TextEncoder();
//     const readableStream = new ReadableStream({
//       async start(controller) {
//         for await (const chunk of stream) {
//           controller.enqueue(encoder.encode(chunk.delta));
//         }
//         controller.close();
//       },
//     });
  
//     return new Response(readableStream, {
//       headers: {
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive',
//       },
//     });
//   }


import { Cencori } from 'cencori';

export async function POST(req: Request) {
  const { title, description, tags } = await req.json();

  if (!process.env.CENCORI_API_KEY) {
    return new Response('API key is missing', { status: 500 });
  }

  const cencori = new Cencori({
    apiKey: process.env.CENCORI_API_KEY, // server-only
  });

  const messages: { role: "system" | "user"; content: string }[] = [
    {
        role: 'system',
        content: `
        You are a concise, practical startup strategist.
        
        ONLY output JSON.
        Use double quotes.
        Format:
        
        {
          "title": "Idea Title",
          "problem": ["bullet1", "bullet2"],
          "solution": ["bullet1", "bullet2"],
          "mvp": ["bullet1", "bullet2"],
          "goToMarket": ["bullet1", "bullet2"],
          "monetization": ["bullet1", "bullet2"],
          "risksValidation": ["bullet1", "bullet2"]
        }
        
        Do not include any extra commentary.
        Keep it compact and actionable.
        `.trim(),
    },
    {
      role: "user",
      content: `
Idea Title: ${title || 'Generate one'}
Description / Context: ${description || ''}
Tags: ${tags?.join(', ') || ''}
      `.trim(),
    },
  ];

  const stream = cencori.ai.chatStream({
    model: 'gpt-4o',
    messages,
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.delta));
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
