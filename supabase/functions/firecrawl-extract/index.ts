import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { query, limit = 5, options = {} } = await req.json();

    const url = "https://api.picaos.com/v1/passthrough/v1/search";
    const body = {
      query,
      limit,
      ...options,
    };

    const headers = {
      "Content-Type": "application/json",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_FIRECRAWL_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GClH-wc_XMo::Lm5ew3DCSp2L1yETSndVHA",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: response.ok ? 200 : 400,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});
