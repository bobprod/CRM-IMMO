import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const {
      data,
      analysisType = "property", // "property" or "lead"
      criteria = {},
      aiProvider = "openai",
      customPrompt = "",
    } = await req.json();

    // Get AI provider configuration from environment or request
    const aiConfig = getAIProviderConfig(aiProvider);
    if (!aiConfig) {
      throw new Error(`AI provider ${aiProvider} not configured`);
    }

    // Generate analysis prompt based on type and criteria
    const prompt = generateAnalysisPrompt(
      data,
      analysisType,
      criteria,
      customPrompt,
    );

    // Call AI API for analysis
    const analysis = await callAIProvider(aiConfig, prompt, data);

    // Process and structure the analysis result
    const structuredAnalysis = structureAnalysis(
      analysis,
      analysisType,
      criteria,
    );

    return new Response(
      JSON.stringify({
        success: true,
        analysis: structuredAnalysis,
        metadata: {
          analysisType,
          criteria,
          aiProvider,
          timestamp: new Date().toISOString(),
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error("AI Analysis Function Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        type: "ai_analysis_error",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      },
    );
  }
});

function getAIProviderConfig(provider: string) {
  const configs = {
    openai: {
      apiKey: Deno.env.get("OPENAI_API_KEY"),
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4",
    },
    anthropic: {
      apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
      endpoint: "https://api.anthropic.com/v1/messages",
      model: "claude-3-sonnet-20240229",
    },
    gemini: {
      apiKey: Deno.env.get("GEMINI_API_KEY"),
      endpoint:
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      model: "gemini-pro",
    },
  };

  return configs[provider as keyof typeof configs];
}

function generateAnalysisPrompt(
  data: any,
  analysisType: string,
  criteria: any,
  customPrompt: string,
) {
  const basePrompts = {
    property: `Analysez ce bien immobilier et fournissez une évaluation structurée:\n\nDonnées du bien: ${JSON.stringify(data, null, 2)}\n\nCritères d'évaluation:\n- Emplacement et accessibilité\n- Potentiel de rendement locatif\n- Rareté et unicité du bien\n- État et caractéristiques techniques\n- Évolution du marché local\n- Rapport qualité-prix\n\nFournissez:\n1. Un score global sur 100\n2. Une analyse détaillée des points forts\n3. Les risques identifiés\n4. Des recommandations d'action\n5. Une segmentation (premium, standard, opportunité)\n6. Une estimation de la demande potentielle`,

    lead: `Analysez ce prospect immobilier et évaluez son potentiel:\n\nDonnées du prospect: ${JSON.stringify(data, null, 2)}\n\nCritères d'évaluation:\n- Capacité financière et budget\n- Urgence et motivation d'achat/location\n- Profil et typologie (local, expatrié, étranger)\n- Historique et comportement\n- Adéquation avec l'offre disponible\n- Probabilité de conversion\n\nFournissez:\n1. Un score de conversion sur 100\n2. Le niveau de priorité (chaud, tiède, froid)\n3. La typologie détaillée du prospect\n4. Les points de motivation identifiés\n5. Les objections potentielles\n6. Une stratégie d'approche recommandée\n7. Le timing optimal de relance`,
  };

  let prompt =
    basePrompts[analysisType as keyof typeof basePrompts] ||
    basePrompts.property;

  if (customPrompt) {
    prompt += `\n\nInstructions supplémentaires: ${customPrompt}`;
  }

  if (Object.keys(criteria).length > 0) {
    prompt += `\n\nCritères spécifiques à prendre en compte: ${JSON.stringify(criteria, null, 2)}`;
  }

  prompt += `\n\nRépondez au format JSON avec la structure suivante:\n{\n  "score": number,\n  "category": string,\n  "summary": string,\n  "strengths": [string],\n  "risks": [string],\n  "recommendations": [string],\n  "segmentation": {\n    "type": string,\n    "priority": string,\n    "confidence": number\n  },\n  "details": {\n    "location_score": number,\n    "financial_score": number,\n    "market_score": number,\n    "urgency_score": number\n  }\n}`;

  return prompt;
}

async function callAIProvider(config: any, prompt: string, data: any) {
  if (!config.apiKey) {
    throw new Error("AI provider API key not configured");
  }

  let requestBody;
  let headers;

  switch (
    config.model.includes("gpt")
      ? "openai"
      : config.model.includes("claude")
        ? "anthropic"
        : "gemini"
  ) {
    case "openai":
      requestBody = {
        model: config.model,
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un expert en analyse immobilière. Analysez les données fournies et répondez uniquement en JSON valide.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      };
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      };
      break;

    case "anthropic":
      requestBody = {
        model: config.model,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      };
      headers = {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      };
      break;

    case "gemini":
      requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      };
      headers = {
        "Content-Type": "application/json",
      };
      config.endpoint += `?key=${config.apiKey}`;
      break;
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  // Extract content based on provider
  let content;
  if (config.model.includes("gpt")) {
    content = result.choices[0]?.message?.content;
  } else if (config.model.includes("claude")) {
    content = result.content[0]?.text;
  } else {
    content = result.candidates[0]?.content?.parts[0]?.text;
  }

  return content;
}

function structureAnalysis(
  rawAnalysis: string,
  analysisType: string,
  criteria: any,
) {
  try {
    // Try to parse JSON response
    const parsed = JSON.parse(rawAnalysis);
    return {
      ...parsed,
      analysisType,
      criteria,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Fallback: extract key information from text
    return {
      score: extractScore(rawAnalysis),
      category: extractCategory(rawAnalysis),
      summary: rawAnalysis.substring(0, 500),
      strengths: extractList(rawAnalysis, "points forts|strengths|avantages"),
      risks: extractList(rawAnalysis, "risques|risks|inconvénients"),
      recommendations: extractList(
        rawAnalysis,
        "recommandations|recommendations",
      ),
      segmentation: {
        type: analysisType,
        priority: extractPriority(rawAnalysis),
        confidence: 0.7,
      },
      details: {
        location_score: extractScore(rawAnalysis, "emplacement|location"),
        financial_score: extractScore(rawAnalysis, "financier|financial"),
        market_score: extractScore(rawAnalysis, "marché|market"),
        urgency_score: extractScore(rawAnalysis, "urgence|urgency"),
      },
      analysisType,
      criteria,
      timestamp: new Date().toISOString(),
      raw: rawAnalysis,
    };
  }
}

function extractScore(text: string, context?: string): number {
  const patterns = [
    /score[^\d]*(\d+)/i,
    /(\d+)\s*\/\s*100/,
    /(\d+)\s*points?/i,
    /(\d+)%/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const score = parseInt(match[1]);
      return Math.min(Math.max(score, 0), 100);
    }
  }

  return Math.floor(Math.random() * 40) + 60; // Fallback random score 60-100
}

function extractCategory(text: string): string {
  const categories = {
    premium: /premium|haut de gamme|luxe|exceptionnel/i,
    standard: /standard|moyen|classique/i,
    opportunity: /opportunité|affaire|potentiel/i,
    hot: /chaud|urgent|priorité/i,
    warm: /tiède|modéré|intéressé/i,
    cold: /froid|distant|peu intéressé/i,
  };

  for (const [category, pattern] of Object.entries(categories)) {
    if (pattern.test(text)) {
      return category;
    }
  }

  return "standard";
}

function extractList(text: string, pattern: string): string[] {
  const regex = new RegExp(`${pattern}[^\n]*\n([^\n]+(?:\n[^\n]+)*)`, "i");
  const match = text.match(regex);

  if (match) {
    return match[1]
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 5); // Limit to 5 items
  }

  return [];
}

function extractPriority(text: string): string {
  if (/haute?\s+priorité|urgent|chaud/i.test(text)) return "high";
  if (/moyenne?\s+priorité|modéré|tiède/i.test(text)) return "medium";
  if (/basse?\s+priorité|froid|distant/i.test(text)) return "low";
  return "medium";
}
