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
      action = "search", // "search" or "crawl"
      url: targetUrl,
      query,
      limit = 5,
      start = 0, // For pagination
      num = 10, // Number of results per page
      options = {},
      saveParams = false,
      loadSavedParams = false,
      savedParamsId = null,
      // Crawl-specific parameters
      webhook,
      scrapeOptions = {},
      excludePaths = [],
      includePaths = [],
      maxDepth = 2,
      ignoreSitemap = false,
      ignoreQueryParameters = false,
      allowBackwardLinks = false,
      allowExternalLinks = false,
      // AI Analysis parameters
      aiAnalysis = false,
      aiPrompt = "",
      scoringCriteria = {},
      segmentationRules = {},
    } = await req.json();

    let finalParams;
    let apiUrl;
    let actionId;

    if (action === "crawl") {
      // Crawl action parameters
      finalParams = {
        url: targetUrl,
        webhook,
        scrapeOptions: {
          actions: [{ type: "wait" }],
          formats: scrapeOptions.formats || ["markdown"],
          onlyMainContent: scrapeOptions.onlyMainContent !== false,
          includeTags: scrapeOptions.includeTags || [],
          excludeTags: scrapeOptions.excludeTags || [],
          headers: scrapeOptions.headers || {},
          waitFor: scrapeOptions.waitFor || 0,
          mobile: scrapeOptions.mobile || false,
          skipTlsVerification: scrapeOptions.skipTlsVerification || false,
          timeout: scrapeOptions.timeout || 30000,
          jsonOptions: {
            schema: scrapeOptions.jsonOptions?.schema,
            systemPrompt: scrapeOptions.jsonOptions?.systemPrompt || aiPrompt,
            prompt: scrapeOptions.jsonOptions?.prompt,
          },
          location: {
            country: scrapeOptions.location?.country || "TN",
            languages: scrapeOptions.location?.languages || ["fr"],
          },
          removeBase64Images: scrapeOptions.removeBase64Images !== false,
          blockAds: scrapeOptions.blockAds !== false,
          proxy: scrapeOptions.proxy || "stealth",
        },
        excludePaths,
        includePaths,
        maxDepth,
        ignoreSitemap,
        ignoreQueryParameters,
        limit,
        allowBackwardLinks,
        allowExternalLinks,
      };
      apiUrl = "https://api.picaos.com/v1/passthrough/crawl";
      actionId = "conn_mod_def::GClH_mo3YYg::aIBsc5axSY6zSqWRu0s-hg";
    } else {
      // Search action parameters with pagination support
      finalParams = {
        query,
        limit: Math.min(limit, 10), // Max 10 per API call
        start,
        num: Math.min(num, 10),
        ...options,
      };
      apiUrl = "https://api.picaos.com/v1/passthrough/v1/search";
      actionId = "conn_mod_def::GClH-wc_XMo::Lm5ew3DCSp2L1yETSndVHA";
    }

    // Load saved parameters if requested
    if (loadSavedParams && savedParamsId) {
      try {
        const savedParams = await loadFirecrawlParams(savedParamsId);
        if (savedParams) {
          finalParams = { ...savedParams, ...finalParams }; // Override with current params
        }
      } catch (error) {
        console.warn("Failed to load saved params:", error);
      }
    }

    // Save parameters if requested
    if (saveParams) {
      try {
        const paramsId = await saveFirecrawlParams({
          ...finalParams,
          action,
          aiAnalysis,
          aiPrompt,
          scoringCriteria,
          segmentationRules,
        });
        console.log("Parameters saved with ID:", paramsId);
      } catch (error) {
        console.warn("Failed to save params:", error);
      }
    }

    const headers = {
      "Content-Type": "application/json",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_FIRECRAWL_CONNECTION_KEY")!,
      "x-pica-action-id": actionId,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(finalParams),
    });

    const result = await response.json();

    // Enhanced response with parameter info and AI analysis metadata
    const responseData = {
      ...result,
      _metadata: {
        action,
        usedParams: finalParams,
        timestamp: new Date().toISOString(),
        savedParams: saveParams,
        loadedParams: loadSavedParams,
        aiAnalysis: aiAnalysis,
        scoringCriteria,
        segmentationRules,
      },
    };

    return new Response(JSON.stringify(responseData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: response.ok ? 200 : 400,
    });
  } catch (error) {
    console.error("Firecrawl Function Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        type: "function_error",
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

// Helper functions for parameter persistence
async function saveFirecrawlParams(params: any): Promise<string> {
  const paramsId = `firecrawl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const paramsData = {
    id: paramsId,
    params,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };

  // In a real implementation, this would save to a database
  // For now, we'll use Deno KV or similar persistent storage
  try {
    const kv = await Deno.openKv();
    await kv.set(["firecrawl_params", paramsId], paramsData);
    await kv.close();
  } catch (error) {
    console.warn("KV storage not available, using in-memory storage");
    // Fallback to environment variable or file storage
  }

  return paramsId;
}

async function loadFirecrawlParams(paramsId: string): Promise<any | null> {
  try {
    const kv = await Deno.openKv();
    const result = await kv.get(["firecrawl_params", paramsId]);
    await kv.close();

    if (result.value) {
      return (result.value as any).params;
    }
  } catch (error) {
    console.warn("Failed to load from KV storage:", error);
  }

  return null;
}

// Function to list saved parameter sets
export async function listSavedFirecrawlParams(): Promise<
  Array<{ id: string; timestamp: string; preview: any }>
> {
  try {
    const kv = await Deno.openKv();
    const entries = [];

    for await (const entry of kv.list({ prefix: ["firecrawl_params"] })) {
      const data = entry.value as any;
      entries.push({
        id: data.id,
        timestamp: data.timestamp,
        preview: {
          query: data.params.query,
          limit: data.params.limit,
        },
      });
    }

    await kv.close();
    return entries.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  } catch (error) {
    console.warn("Failed to list saved params:", error);
    return [];
  }
}
