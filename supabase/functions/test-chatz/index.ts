import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GEMINI_FALLBACK_MODELS } from "../_shared/gemini-fallback.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CHATZ_API_KEY = Deno.env.get("CHATZ_API_KEY") || "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "chatz";

  if (mode === "env") {
    return new Response(JSON.stringify({
      hasChatzKey: !!CHATZ_API_KEY,
      chatzKeyPrefix: CHATZ_API_KEY ? CHATZ_API_KEY.substring(0, 8) + "..." : "MISSING",
      chatzKeyLength: CHATZ_API_KEY.length,
      hasGeminiKey: !!GEMINI_API_KEY,
      geminiKeyPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 8) + "..." : "MISSING",
    }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (mode === "chatz") {
    const models = ["glm-4.6", "glm-4.5", "glm-4-plus"];
    const results = [];

    for (const model of models) {
      const body = JSON.stringify({
        model,
        messages: [{ role: "user", content: "Say hello in one word." }],
        max_tokens: 100,
        temperature: 0.5,
      });

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const response = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${CHATZ_API_KEY}`,
          },
          body,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        const responseText = await response.text();
        let parsed;
        try { parsed = JSON.parse(responseText); } catch { parsed = responseText; }

        results.push({
          model,
          status: response.status,
          ok: response.ok,
          response: parsed,
        });
      } catch (e) {
        results.push({
          model,
          status: 0,
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return new Response(JSON.stringify({
      chatzKeyPresent: !!CHATZ_API_KEY,
      chatzKeyPrefix: CHATZ_API_KEY ? CHATZ_API_KEY.substring(0, 12) + "..." : "MISSING",
      results,
    }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (mode === "gemini") {
    const models = ["gemini-flash-latest", ...GEMINI_FALLBACK_MODELS.filter(m => m !== "gemini-flash-latest")];
    const results = [];

    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Say hello in one word." }] }],
              generationConfig: { temperature: 0.5, maxOutputTokens: 100 },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);

        const responseText = await response.text();
        let parsed;
        try { parsed = JSON.parse(responseText); } catch { parsed = responseText; }

        results.push({
          model,
          status: response.status,
          ok: response.ok,
          response: parsed,
        });
      } catch (e) {
        results.push({
          model,
          status: 0,
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return new Response(JSON.stringify({
      geminiKeyPresent: !!GEMINI_API_KEY,
      fallbackChain: models,
      results,
    }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Unknown mode. Use ?mode=env|chatz|gemini" }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
