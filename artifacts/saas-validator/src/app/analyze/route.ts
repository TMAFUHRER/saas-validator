import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY n'est pas configurée. Ajoutez-la dans les secrets d'environnement." },
      { status: 500 }
    );
  }

  let body: { idea?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { idea } = body;
  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return NextResponse.json(
      { error: "Veuillez fournir une description d'au moins 10 caractères" },
      { status: 400 }
    );
  }

  const prompt = `Tu es un analyste de marché SaaS expert avec 15 ans d'expérience. Analyse l'idée de SaaS suivante et fournis une évaluation précise et réaliste.

${idea.trim()}

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte avant ou après) respectant exactement cette structure :

{
  "willingness_to_pay": <entier 0-100, score mesurant si des gens paient réellement pour ce type de solution — basé sur l'existence de concurrents payants, de publicités actives, de discussions "combien ça coûte" en ligne>,
  "market_saturation": <entier 0-100, où 100 = marché extrêmement saturé avec des dizaines de concurrents bien financés, 0 = marché vierge>,
  "ads_detected": <entier, nombre estimé d'annonces publicitaires actives dans cet espace (Google Ads, Meta Ads, etc.)>,
  "price_range": "<fourchette de prix typique du marché, ex: '29€ - 149€/mois' ou '$19 - $99/mois'>",
  "competitors": ["<nom concurrent 1>", "<nom concurrent 2>", "<nom concurrent 3>", "<nom concurrent 4>", "<nom concurrent 5>"],
  "proof_points": [
    "<preuve concrète que des gens paient pour ce type de solution, ex: 'Notion a levé 275M$ sur ce marché'>",
    "<autre preuve, ex: 'Plus de 500 discussions Reddit demandent exactement cette fonctionnalité'>",
    "<autre preuve, ex: 'Producthunt recense 30+ outils similaires avec des upvotes'>",
    "<autre preuve>"
  ],
  "reddit_insights": [
    "<insight tiré de discussions Reddit/forums sur ce problème, ex: 'Les freelances se plaignent de passer 4h/semaine sur la facturation'>",
    "<autre insight, ex: 'r/entrepreneur mentionne régulièrement ce pain point'>",
    "<autre insight>"
  ],
  "sources_analyzed": <entier entre 15 et 80, nombre de sources analysées (forums, marketplaces, plateformes pub, sites concurrents)>
}

Sois spécifique et honnête. Cite de vrais concurrents. Donne des données réalistes. Réponds uniquement avec le JSON.`;

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
      const status = response.status;
      if (status === 429) {
        return NextResponse.json(
          { error: "Quota Gemini dépassé. Votre limite gratuite est atteinte. Activez la facturation sur aistudio.google.com ou attendez la réinitialisation." },
          { status: 429 }
        );
      }
      const message = errData?.error?.message ?? response.statusText;
      return NextResponse.json({ error: `Erreur API Gemini (${status}): ${message}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: "Réponse vide de Gemini" }, { status: 500 });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Impossible de parser la réponse IA" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: `Analyse échouée: ${message}` }, { status: 500 });
  }
}
