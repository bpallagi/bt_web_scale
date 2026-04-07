export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
//Google Apps Script URL
    const googleScriptUrl = env.gscript_url;
    const googleScriptUrl2 = env.gscript_url;
    try {
      const requestBodyText = await request.text();
      const requestBody = JSON.parse(requestBodyText);
// A Google Apps Script API kulcs
      requestBody.api_key = env.api_key;

      const googleResponse = await fetch(googleScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await googleResponse.text();

      return new Response(responseText, {
        status: googleResponse.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }
  },
};
