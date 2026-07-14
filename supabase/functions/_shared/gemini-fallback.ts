/**
 * Shared Gemini model fallback helper.
 *
 * When a Gemini model returns 503 (UNAVAILABLE) or 429 (quota exceeded),
 * this helper automatically tries the next model in the fallback chain.
 * Other 5xx errors get a single retry on the same model before moving on.
 * 4xx errors (other than 429) throw immediately — the request itself is likely bad.
 *
 * Usage:
 *   import { callGeminiWithFallback, GEMINI_FALLBACK_MODELS } from "../_shared/gemini-fallback.ts";
 *
 *   const result = await callGeminiWithFallback({
 *     prompt: "...",
 *     systemPrompt: "...",        // optional — sent as systemInstruction if provided
 *     apiKey: GEMINI_API_KEY,
 *     temperature: 0.25,
 *     maxOutputTokens: 16384,
 *     timeoutMs: 90000,
 *   });
 *   // result: { text, model, tokenCount }
 */

export interface GeminiCallParams {
  prompt: string;
  systemPrompt?: string;
  apiKey: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
  /** Model to try first before falling through to the chain (default: "gemini-flash-latest"). */
  preferredModel?: string;
  /** Called after a successful request so the caller can track per-model usage. */
  onUsage?: (model: string, tokenCount: number) => void | Promise<void>;
}

export interface GeminiCallResult {
  text: string;
  model: string;
  tokenCount: number;
}

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
];

/**
 * Ordered fallback chain for text-out Gemini models.
 * Ranked by rate-limit headroom (most generous first):
 *   1. gemini-3.1-flash-lite  — 15 RPM, 250K TPM, 500 RPD
 *   2. gemini-2.5-flash-lite — 10 RPM, 250K TPM, 20 RPD
 *   3. gemini-2.5-flash      —  5 RPM, 250K TPM, 20 RPD
 *   4. gemini-3-flash        —  5 RPM, 250K TPM, 20 RPD
 *   5. gemini-3.5-flash      —  5 RPM, 250K TPM, 20 RPD
 *   6. gemini-2-flash        —  unlimited (preview)
 *   7. gemini-2-flash-lite   —  unlimited (preview)
 *   8. gemini-2.5-pro        —  unlimited (preview)
 *   9. gemini-3.1-pro        —  unlimited (preview)
 */
export const GEMINI_FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash",
  "gemini-3.5-flash",
  "gemini-2-flash",
  "gemini-2-flash-lite",
  "gemini-2.5-pro",
  "gemini-3.1-pro",
] as const;

function isRetryable(status: number): boolean {
  return status === 503 || status === 429 || (status >= 500 && status < 600);
}

async function tryModel(
  model: string,
  params: Required<Pick<GeminiCallParams, "prompt" | "apiKey" | "temperature" | "maxOutputTokens" | "timeoutMs">> & { systemPrompt?: string },
): Promise<GeminiCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), params.timeoutMs);

  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: params.prompt }] }],
    generationConfig: {
      temperature: params.temperature,
      maxOutputTokens: params.maxOutputTokens,
    },
    safetySettings: SAFETY_SETTINGS,
  };

  if (params.systemPrompt) {
    body.systemInstruction = { parts: [{ text: params.systemPrompt }] };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${params.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      const err = new Error(`Gemini API ${response.status} (${model}): ${errText.substring(0, 400)}`);
      (err as any).status = response.status;
      (err as any).model = model;
      throw err;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const reason = data.candidates?.[0]?.finishReason;
      throw new Error(`Gemini returned empty content (model: ${model}, finishReason: ${reason || "unknown"})`);
    }

    const tokenCount = data.usageMetadata?.totalTokenCount || 0;
    return { text, model, tokenCount };
  } finally {
    clearTimeout(timeout);
  }
}

export async function callGeminiWithFallback(params: GeminiCallParams): Promise<GeminiCallResult> {
  if (!params.apiKey) throw new Error("No GEMINI_API_KEY provided to callGeminiWithFallback");

  const temperature = params.temperature ?? 0.7;
  const maxOutputTokens = params.maxOutputTokens ?? 8192;
  const timeoutMs = params.timeoutMs ?? 90000;
  const preferredModel = params.preferredModel ?? "gemini-flash-latest";

  const chain: string[] = [preferredModel, ...GEMINI_FALLBACK_MODELS.filter(m => m !== preferredModel)];

  const errors: string[] = [];

  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    try {
      console.log(`Gemini: trying model "${model}" (attempt ${i + 1}/${chain.length})`);
      const result = await tryModel(model, {
        prompt: params.prompt,
        systemPrompt: params.systemPrompt,
        apiKey: params.apiKey,
        temperature,
        maxOutputTokens,
        timeoutMs,
      });

      if (i > 0) {
        console.warn(`Gemini: succeeded on fallback model "${model}" after ${i} previous attempt(s) failed`);
      } else {
        console.log(`Gemini: succeeded on preferred model "${model}"`);
      }

      if (params.onUsage) {
        try { await params.onUsage(result.model, result.tokenCount); } catch (e) { console.error("onUsage callback error:", e); }
      }

      return result;
    } catch (e: any) {
      const status = e?.status ?? 0;
      const msg = e instanceof Error ? e.message : String(e);

      if (e?.name === "AbortError") {
        console.warn(`Gemini: model "${model}" timed out, trying next model...`);
        errors.push(`${model}: timeout`);
        continue;
      }

      if (status === 503 || status === 429) {
        console.warn(`Gemini: model "${model}" returned ${status}, falling through to next model...`);
        errors.push(`${model}: ${status}`);
        continue;
      }

      if (status >= 500) {
        if (i < chain.length - 1) {
          console.warn(`Gemini: model "${model}" returned ${status}, retrying once then falling through...`);
          await new Promise(r => setTimeout(r, 2000));
          try {
            const retryResult = await tryModel(model, {
              prompt: params.prompt,
              systemPrompt: params.systemPrompt,
              apiKey: params.apiKey,
              temperature,
              maxOutputTokens,
              timeoutMs,
            });
            console.warn(`Gemini: succeeded on model "${model}" after retry`);
            if (params.onUsage) {
              try { await params.onUsage(retryResult.model, retryResult.tokenCount); } catch (e) { console.error("onUsage callback error:", e); }
            }
            return retryResult;
          } catch (retryErr: any) {
            const retryStatus = retryErr?.status ?? 0;
            if (retryStatus === 503 || retryStatus === 429 || retryStatus >= 500) {
              console.warn(`Gemini: model "${model}" retry also failed (${retryStatus}), falling through...`);
              errors.push(`${model}: ${retryStatus} (after retry)`);
              continue;
            }
            errors.push(`${model}: ${retryErr.message}`);
            continue;
          }
        }
        errors.push(`${model}: ${status}`);
        continue;
      }

      // 4xx (non-429) — don't try other models, the request is likely the problem
      throw e;
    }
  }

  throw new Error(`All Gemini models exhausted. Attempts: ${errors.join("; ")}`);
}
