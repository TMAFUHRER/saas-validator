import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured. Please add it to your environment secrets." },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  let body: { idea?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { idea } = body;
  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return NextResponse.json(
      { error: "Please provide a SaaS idea with at least 10 characters" },
      { status: 400 }
    );
  }

  const prompt = `You are an expert SaaS market analyst with 15 years of experience evaluating startup ideas. Analyze the following SaaS business idea and provide a detailed, honest, and realistic assessment.

SaaS Idea: ${idea.trim()}

Provide your analysis as a single JSON object with this exact structure:

{
  "market_size": {
    "score": <integer 1-10, where 10 = massive market>,
    "summary": "<one compelling sentence about market size>",
    "details": "<2-3 sentences with specific context, estimates, and trends>"
  },
  "competition": {
    "score": <integer 1-10, where 10 = extremely crowded market, 1 = blue ocean>,
    "summary": "<one sentence naming key competitors or describing landscape>",
    "details": "<2-3 sentences about the competitive dynamics and differentiation opportunity>"
  },
  "technical_complexity": {
    "score": <integer 1-10, where 10 = extremely complex to build>,
    "summary": "<one sentence about build complexity>",
    "details": "<2-3 sentences about technical challenges, stack requirements, and timeline>"
  },
  "target_audience": {
    "primary": "<specific role/persona of the ideal first customer>",
    "size": "<estimated number of potential customers globally>",
    "details": "<2-3 sentences about audience pain points, buying behavior, and willingness to pay>"
  },
  "revenue_potential": {
    "score": <integer 1-10, where 10 = very high revenue ceiling>,
    "model": "<specific pricing model recommendation, e.g. 'Per-seat SaaS, $29-99/mo'>",
    "summary": "<one sentence about revenue ceiling and growth path>",
    "details": "<2-3 sentences about pricing strategy, ACV range, and path to $1M ARR>"
  },
  "key_risks": [
    "<specific risk 1>",
    "<specific risk 2>",
    "<specific risk 3>",
    "<specific risk 4>"
  ],
  "opportunities": [
    "<specific untapped opportunity 1>",
    "<specific untapped opportunity 2>",
    "<specific untapped opportunity 3>"
  ],
  "go_to_market": "<2-3 sentences describing the most effective customer acquisition strategy for this specific idea>",
  "overall_verdict": {
    "score": <integer 1-10, overall viability score>,
    "recommendation": "<exactly one of: Strong Go, Proceed with Caution, Needs Pivoting, Avoid>",
    "summary": "<2-3 sentences of honest overall assessment with the most important insight>"
  }
}

Be specific, honest, and actionable. Name real competitors. Give real market size estimates. Avoid generic advice. Only return the JSON object — no markdown, no explanation, no preamble.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response from AI" }, { status: 500 });
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `AI analysis failed: ${message}` }, { status: 500 });
  }
}
