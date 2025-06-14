import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { query, options = {} } = await req.json();

    // Use the correct Pica passthrough endpoint for SerpApi
    const url = "https://api.picaos.com/v1/passthrough/search";

    // Build query parameters
    const params = new URLSearchParams();
    params.append("q", query);
    if (options.location) params.append("location", options.location);
    if (options.google_domain)
      params.append("google_domain", options.google_domain);
    if (options.gl) params.append("gl", options.gl);
    if (options.hl) params.append("hl", options.hl);
    if (options.device) params.append("device", options.device);
    if (options.num) params.append("num", options.num.toString());
    if (options.start) params.append("start", options.start.toString());

    const headers = {
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_SERP_API_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GCMod7dviGg::xZnK1c2iRYugO4QvBVtMUA",
    };

    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    // Provide more detailed error information
    if (!response.ok) {
      console.error("SerpApi Error:", {
        status: response.status,
        statusText: response.statusText,
        result,
        headers: Object.fromEntries(response.headers.entries()),
      });

      return new Response(
        JSON.stringify({
          error:
            result.error || `HTTP ${response.status}: ${response.statusText}`,
          details: result,
          status: response.status,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("SerpApi Function Error:", error);
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
