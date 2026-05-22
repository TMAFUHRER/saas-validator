import { NextRequest, NextResponse } from "next/server";
import type { Lang } from "@/lib/i18n";

function buildPrompt(idea: string, lang: Lang): string {
  const langInstructions: Record<Lang, { intro: string; languageNote: string; exampleProof: string; exampleReddit: string }> = {
    fr: {
      intro: "Tu es un analyste de marché SaaS expert avec 15 ans d'expérience. Analyse l'idée de SaaS suivante et fournis une évaluation précise et réaliste.",
      languageNote: "Réponds en français. Tous les textes dans proof_points, reddit_insights doivent être en français.",
      exampleProof: "'Notion a levé 275M$ sur ce marché'",
      exampleReddit: "'Les freelances se plaignent de passer 4h/semaine sur la facturation'",
    },
    en: {
      intro: "You are an expert SaaS market analyst with 15 years of experience. Analyze the following SaaS idea and provide a precise, realistic evaluation.",
      languageNote: "Respond in English. All text in proof_points and reddit_insights must be in English.",
      exampleProof: "'Notion raised $275M in this market'",
      exampleReddit: "'Freelancers complain about spending 4 hours/week on invoicing'",
    },
    es: {
      intro: "Eres un analista de mercado SaaS experto con 15 años de experiencia. Analiza la siguiente idea de SaaS y proporciona una evaluación precisa y realista.",
      languageNote: "Responde en español. Todo el texto en proof_points y reddit_insights debe estar en español.",
      exampleProof: "'Notion recaudó 275M$ en este mercado'",
      exampleReddit: "'Los freelancers se quejan de pasar 4 horas/semana en facturación'",
    },
  };

  const { intro, languageNote, exampleProof, exampleReddit } = langInstructions[lang] ?? langInstructions.fr;

  return `${intro}

${idea.trim()}

${languageNote}

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte avant ou après) respectant exactement cette structure :

{
  "willingness_to_pay": <integer 0-100, score measuring whether people actually pay for this type of solution — based on the existence of paying competitors, active ads, and online "how much does it cost" discussions>,
  "market_saturation": <integer 0-100, where 100 = extremely saturated market with dozens of well-funded competitors, 0 = virgin market>,
  "ads_detected": <integer, estimated number of active ads in this space (Google Ads, Meta Ads, etc.)>,
  "price_range": "<typical market price range, e.g. '$29 - $149/month' or '29€ - 99€/mois'>",
  "competitors": ["<competitor name 1>", "<competitor name 2>", "<competitor name 3>", "<competitor name 4>", "<competitor name 5>"],
  "proof_points": [
    ${exampleProof},
    "<another concrete proof that people pay for this type of solution>",
    "<another proof>",
    "<another proof>"
  ],
  "reddit_insights": [
    ${exampleReddit},
    "<another insight from Reddit/forum discussions about this problem>",
    "<another insight>"
  ],
  "sources_analyzed": <integer between 15 and 80, number of sources analyzed (forums, marketplaces, ad platforms, competitor sites)>
}

Be specific and honest. Cite real competitors. Give realistic data. Respond ONLY with the JSON.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: { idea?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { idea, language } = body;
  const lang: Lang = (["fr", "en", "es"].includes(language ?? "") ? language : "fr") as Lang;

  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return NextResponse.json({ error: "Please provide a description of at least 10 characters" }, { status: 400 });
  }

  const prompt = buildPrompt(idea, lang);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Gemini quota exceeded. Your free tier limit has been reached. Enable billing at aistudio.google.com or wait for the quota to reset." },
          { status: 429 }
        );
      }
      const message = errData?.error?.message ?? response.statusText;
      return NextResponse.json({ error: `Gemini API error (${response.status}): ${message}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: "Empty response from Gemini" }, { status: 500 });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse AI response" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Analysis failed: ${message}` }, { status: 500 });
  }
}
