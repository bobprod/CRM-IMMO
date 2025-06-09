import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { domain, emailData } = await req.json();

    const url = `${Deno.env.get("MAILGUN_ENDPOINT")}/v3/${domain}/messages`;
    const form = new FormData();

    for (const key in emailData) {
      if (Array.isArray(emailData[key])) {
        emailData[key].forEach((val: string) => form.append(key, val));
      } else {
        form.append(key, emailData[key]);
      }
    }

    const headers = {
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_MAILGUN_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GDZyQu30Pmg::9nm34WfDS0mYXuJmihxLhg",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: form,
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
