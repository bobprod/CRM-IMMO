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

    const url = new URL("https://api.picaos.com/v1/passthrough/search");
    url.searchParams.append("q", query);
    if (options.location) url.searchParams.append("location", options.location);
    if (options.google_domain)
      url.searchParams.append("google_domain", options.google_domain);
    if (options.gl) url.searchParams.append("gl", options.gl);
    if (options.hl) url.searchParams.append("hl", options.hl);
    if (options.device) url.searchParams.append("device", options.device);

    const headers = {
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_SERP_API_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GCMod7dviGg::xZnK1c2iRYugO4QvBVtMUA",
    };

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
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
