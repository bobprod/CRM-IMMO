import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { serviceSid, sid, data } = await req.json();

    const url = `https://verify.twilio.com/v2/Services/${serviceSid}/Webhooks/${sid}`;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_TWILIO_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GC7O6JcKir8::bb_ivBihQWG7I1-EjRVhzg",
    };

    const body = new URLSearchParams(data).toString();

    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
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
