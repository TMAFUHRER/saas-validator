import { NextRequest, NextResponse } from "next/server";
import type { Lang } from "@/lib/i18n";

function buildPrompt(idea: string, lang: Lang): string {
  const langInstructions: Record<
    Lang,
    { intro: string; languageNote: string; currency: string }
  > = {
    fr: {
      intro:
        "Tu es un analyste de marché SaaS expert avec 15 ans d'expérience en venture capital et product strategy. Analyse l'idée de SaaS suivante et fournis une évaluation précise, réaliste et actionnable.",
      languageNote:
        "Réponds UNIQUEMENT en français. Tous les textes libres (explanations, proof_points, reddit_insights, finding, description) doivent être en français.",
      currency: "€ ou $ selon le marché",
    },
    en: {
      intro:
        "You are an expert SaaS market analyst with 15 years of experience in venture capital and product strategy. Analyze the following SaaS idea and provide a precise, realistic, and actionable evaluation.",
      languageNote:
        "Respond ONLY in English. All free-text fields (explanations, proof_points, reddit_insights, finding, description) must be in English.",
      currency: "$",
    },
    es: {
      intro:
        "Eres un analista de mercado SaaS experto con 15 años de experiencia en capital de riesgo y estrategia de producto. Analiza la siguiente idea de SaaS y proporciona una evaluación precisa, realista y accionable.",
      languageNote:
        "Responde ÚNICAMENTE en español. Todos los textos libres (explanations, proof_points, reddit_insights, finding, description) deben estar en español.",
      currency: "$ o €",
    },
  };

  const { intro, languageNote, currency } =
    langInstructions[lang] ?? langInstructions.fr;

  return `${intro}

IDEA TO ANALYZE:
${idea.trim()}

${languageNote}

Respond ONLY with a valid JSON object (no markdown, no text before or after) matching EXACTLY this structure:

{
  "willingness_to_pay": <integer 0-100. Measures whether people actually pay for this type of solution: 0=nobody pays, 100=massive paid market with thousands of paying customers. Base this on: existence of paying competitors, active paid ads, price discussions in communities, app marketplace paid listings>,
  "willingness_to_pay_explanation": "<1-2 sentences with specific evidence: cite a real competitor or real signal that people pay>",
  "market_saturation": <integer 0-100. 0=untouched virgin market, 100=hyper-competitive with 50+ well-funded players. Be realistic — most SaaS niches are 40-70>,
  "market_saturation_explanation": "<1-2 sentences explaining the competitive landscape: how many active players, funding levels, market crowdedness>",
  "verdict_explanation": "<3-5 sentences. Explain: (1) what the payment score of X/100 means for this market, (2) what the saturation score of Y/100 means for competition, (3) key market context or opportunity, (4) what gap competitors don't cover that this idea could fill, (5) concrete recommendation — go or not, what angle to take, and a suggested price point like '${currency}XX-XX/month'>",
  "ads_detected": <integer 5-500, estimated number of active paid ads in this space across Google Ads, Meta Ads, LinkedIn Ads — be realistic>,
  "price_range": "<realistic market price range, e.g. '29${currency} - 149${currency}/mois' or '$19 - $99/month'>",
  "competitors": [
    {
      "name": "<real competitor name — must be a real product that exists>",
      "arr_range": "<estimated annual recurring revenue, e.g. '100k-500k$ ARR' or '1M-5M$ ARR' or '10M-50M$ ARR'>",
      "description": "<one sentence: what they do specifically and their main positioning/differentiator>"
    }
  ],
  "proof_points": [
    "<SPECIFIC concrete fact with source, e.g. 'X concurrent(s) diffuse(nt) des publicités Meta actives ciblant les freelances avec des budgets estimés à 5-20k$/mois'>",
    "<SPECIFIC fact, e.g. 'Sur Product Hunt, [Product Name] a reçu X upvotes et figure parmi les top produits de la catégorie Y'>",
    "<SPECIFIC fact, e.g. 'Les avis G2 de [Competitor] indiquent que les utilisateurs paient en moyenne X-Y$/mois avec un taux de renouvellement élevé'>",
    "<SPECIFIC fact, e.g. 'Google Trends montre une croissance de X% sur 12 mois pour les recherches liées à Y'>",
    "<SPECIFIC fact, e.g. 'Sur r/SaaS et r/entrepreneur, plus de X posts par mois demandent des solutions à ce problème'>"
  ],
  "reddit_insights": [
    "<specific quote-style insight from Reddit/forum, e.g. 'Sur r/freelance: les utilisateurs se plaignent de passer X heures/semaine sur cette tâche et cherchent une solution automatisée'>",
    "<another specific Reddit/forum insight>",
    "<another insight>"
  ],
  "sources": [
    {
      "name": "META ADS",
      "sentiment": "<positive|negative|mixed>",
      "finding": "<one specific sentence: e.g. 'X+ annonces actives détectées ciblant [audience] avec des messages axés sur [benefit], indicateur fort de demande payante'>"
    },
    {
      "name": "REDDIT",
      "sentiment": "<positive|negative|mixed>",
      "finding": "<one specific sentence about what Reddit/forums reveal about this problem and demand>"
    },
    {
      "name": "PRODUCT HUNT",
      "sentiment": "<positive|negative|mixed>",
      "finding": "<one specific sentence: e.g. 'X produits similaires lancés sur Product Hunt avec une moyenne de Y upvotes, validant l'intérêt de la communauté tech'>"
    },
    {
      "name": "G2",
      "sentiment": "<positive|negative|mixed>",
      "finding": "<one specific sentence about reviews, pricing signals, or user satisfaction found on G2/Capterra>"
    },
    {
      "name": "GOOGLE TRENDS",
      "sentiment": "<positive|negative|mixed>",
      "finding": "<one specific sentence about search trend direction, volume estimate, and seasonality>"
    }
  ],
  "sources_analyzed": <integer between 20 and 80>
}

IMPORTANT RULES:
- All competitor names must be REAL products that exist on the market
- Be brutally honest — not every idea is a good one
- Proof points must cite specific, plausible facts (you can estimate but make them realistic)
- The verdict_explanation should be the most valuable part — give real strategic advice
- Respond ONLY with the JSON object, nothing else`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured." },
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
  const lang: Lang = (["fr", "en", "es"].includes(language ?? "")
    ? language
    : "fr") as Lang;

  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return NextResponse.json(
      { error: "Please provide a description of at least 10 characters" },
      { status: 400 }
    );
  }

  const prompt = buildPrompt(idea, lang);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Anthropic rate limit reached. Please wait a moment and try again.",
          },
          { status: 429 }
        );
      }
      const message = errData?.error?.message ?? response.statusText;
      return NextResponse.json(
        { error: `Anthropic API error (${response.status}): ${message}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Claude" },
        { status: 500 }
      );
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response" },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
