import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const url = new URL("https://api.picaos.com/v1/passthrough/me");
    url.searchParams.append(
      "fields",
      "account_id,adset_id,bid_amount,campaign_id,configured_status,conversion_specs,created_time,creative,display_sequence,effective_status,id,last_updated_by_app_id,name,priority,recommendations,source_ad_id,status,targeting,tracking_specs,updated_time",
    );

    const headers = {
      "content-type": "application/json",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_META_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GCt0jtIxY_E::qgzgCmSdQ5KjxDIpoEXvYA",
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
