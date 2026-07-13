import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const CHATZ_API_KEY = Deno.env.get("CHATZ_API_KEY") || "";

const CHATZ_MODEL = "glm-4.6";
const GEMINI_MODEL = "gemini-flash-latest";
const MAX_TOKENS = 16384;
const TEMPERATURE = 0.25;
const TIMEOUT_MS = 90000;

function errorResponse(status: number, error: string, details?: Record<string, unknown>) {
  return new Response(JSON.stringify({ error, ...details }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function successResponse(data: Record<string, unknown>) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function adminQuery(table: string, select: string, filter: Record<string, string>) {
  const params = new URLSearchParams();
  params.set("select", select);
  for (const [key, value] of Object.entries(filter)) {
    params.set(key, `eq.${value}`);
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Admin query ${table} failed: ${res.status} ${text}`);
    return { data: null, error: `${res.status}: ${text}` };
  }
  return { data: await res.json(), error: null };
}

async function adminUpsert(table: string, matchKey: string, matchValue: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchKey}=eq.${matchValue}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation,upsert=true",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error(`Admin upsert ${table} failed: ${res.status} ${await res.text()}`);
    return null;
  }
  return await res.json();
}

async function adminInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error(`Admin insert ${table} failed: ${res.status} ${await res.text()}`);
    return null;
  }
  return await res.json();
}

async function adminUpdate(table: string, id: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error(`Admin update ${table} failed: ${res.status} ${await res.text()}`);
    return null;
  }
  return await res.json();
}

async function trackUsage(table: string, model: string, tokenCount: number = 0) {
  const today = new Date().toISOString().split('T')[0];
  try {
    const { data: existing } = await adminQuery(table, "id,request_count,token_count", { request_date: today, model });
    if (existing && Array.isArray(existing) && existing.length > 0) {
      const row = existing[0];
      await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${row.id}`, {
        method: "PATCH",
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ request_count: (row.request_count || 0) + 1, token_count: (row.token_count || 0) + tokenCount, last_used_at: new Date().toISOString() }),
      });
    } else {
      await adminInsert(table, { model, request_date: today, request_count: 1, token_count: tokenCount, last_used_at: new Date().toISOString() });
    }
  } catch (err) {
    console.error(`Failed to track ${table} usage:`, err);
  }
}

interface AIResult {
  text: string;
  model: string;
  provider: 'chatz' | 'fallback_gemini';
  tokenCount: number;
}

async function callChatzAI(prompt: string): Promise<AIResult> {
  const body = JSON.stringify({
    model: CHATZ_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
  });
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CHATZ_API_KEY}` };

  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
        method: 'POST', headers, body, signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const errText = await response.text();
        let errCode = '';
        try { errCode = JSON.parse(errText)?.error?.code || ''; } catch {}
        console.error(`Chatz API error ${response.status} (code ${errCode}): ${errText.substring(0, 400)}`);
        if (attempt === 1 && (response.status === 429 || response.status >= 500)) {
          console.warn(`Chatz transient error (attempt ${attempt}), retrying in 3s...`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        throw new Error(`Chatz API ${response.status} (code ${errCode}): ${errText.substring(0, 400)}`);
      }
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Chatz returned empty content');
      const tokenCount = data.usage?.total_tokens || 0;
      await trackUsage("chatz_api_usage", CHATZ_MODEL, tokenCount);
      return { text, model: `chatz-${CHATZ_MODEL}`, provider: 'chatz', tokenCount };
    } catch (e) {
      clearTimeout(timeout);
      if (attempt === 2) throw e;
      if (e instanceof Error && e.name === 'AbortError') {
        console.warn('Chatz request timed out on attempt 1, retrying...');
        continue;
      }
      throw e;
    }
  }
  throw new Error('Chatz API exhausted retries');
}

async function callGeminiAI(prompt: string): Promise<AIResult> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: TEMPERATURE, maxOutputTokens: MAX_TOKENS },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    if (response.status === 429) {
      throw new Error(`Gemini quota exceeded (429): ${err.substring(0, 200)}`);
    }
    throw new Error(`Gemini API ${response.status}: ${err.substring(0, 400)}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const reason = data.candidates?.[0]?.finishReason;
    throw new Error(`Gemini returned empty content (finishReason: ${reason || 'unknown'})`);
  }
  await trackUsage("gemini_api_usage", GEMINI_MODEL);
  return { text, model: `gemini-${GEMINI_MODEL}`, provider: 'fallback_gemini', tokenCount: 0 };
}

async function generateWithAI(prompt: string): Promise<AIResult & { chatzError?: string }> {
  if (CHATZ_API_KEY) {
    try {
      console.log('Attempting chat.z.ai...');
      const result = await callChatzAI(prompt);
      return { ...result, provider: 'chatz' };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.warn(`Chatz failed: ${errMsg} — falling back to Gemini`);
      if (!GEMINI_API_KEY) throw new Error(`Chatz failed (${errMsg}) and no GEMINI_API_KEY fallback available`);
      console.log('Using Gemini fallback...');
      const geminiResult = await callGeminiAI(prompt);
      return { ...geminiResult, chatzError: errMsg };
    }
  } else {
    console.warn('CHATZ_API_KEY not set — using Gemini directly');
  }
  if (!GEMINI_API_KEY) throw new Error('Both CHATZ_API_KEY and GEMINI_API_KEY are missing');
  console.log('Using Gemini fallback...');
  return await callGeminiAI(prompt);
}

function buildRefreshPrompt(documentType: string, briefContent: string, updateInstructions: string): string {
  const parts: string[] = [];

  parts.push(`DOCUMENT REFRESH REQUEST - UPDATE EXISTING DOCUMENT
================================================

This is a REFRESH of an existing ${documentType.replace(/_/g, ' ')} document.
The client has requested updates to their previously generated document.

CRITICAL INSTRUCTIONS:
- Preserve the existing document structure and formatting
- Maintain the same professional quality and brand voice
- Incorporate ONLY the changes described in the UPDATE INSTRUCTIONS section below
- Do not regenerate the entire document from scratch
- Keep all clauses and sections that are not explicitly mentioned for change
- Ensure changes integrate seamlessly with the existing content
- Return the complete updated document (not a diff or partial update)

`);

  parts.push(`=== ORIGINAL CLIENT BRIEF ===
${briefContent}

`);

  parts.push(`=== UPDATE INSTRUCTIONS (CRITICAL) ===
${updateInstructions}

`);

  parts.push(`=== OUTPUT REQUIREMENTS ===
Generate the UPDATED ${documentType.replace(/_/g, ' ')} document now, applying the changes above while preserving all other content and structure from the previous version.

Return ONLY the document content with no meta-commentary or explanations.
`);

  return parts.join('');
}

async function verifyAdminAuth(authHeader: string | null): Promise<{ isAdmin: boolean; adminId?: string; error?: string }> {
  if (!authHeader) {
    return { isAdmin: false, error: 'Missing authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return { isAdmin: false, error: 'Invalid authorization format' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { isAdmin: false, error: 'Invalid token' };
    }

    const user = await res.json();
    const email = user.email;
    const appMetadata = user.app_metadata || {};
    const role = appMetadata.role;

    if (role === 'admin' || email === 'foundationarybusiness@gmail.com') {
      return { isAdmin: true, adminId: user.id };
    }

    return { isAdmin: false, error: 'User is not an admin' };
  } catch (err) {
    return { isAdmin: false, error: 'Authentication verification failed' };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse(405, "Method not allowed");
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const authResult = await verifyAdminAuth(authHeader);

    if (!authResult.isAdmin) {
      return errorResponse(401, authResult.error || "Unauthorized");
    }

    const body = await req.json();
    const { clientId, subscriptionId, serviceId, documentTypes, updateInstructions, clientNotes, adminNotes } = body;

    if (!clientId || !serviceId || !documentTypes || !Array.isArray(documentTypes) || documentTypes.length === 0) {
      return errorResponse(400, "Missing required fields: clientId, serviceId, documentTypes (non-empty array)");
    }

    if (!updateInstructions || updateInstructions.trim().length < 10) {
      return errorResponse(400, "updateInstructions must be at least 10 characters");
    }

    // Fetch client's brief
    const { data: briefData, error: briefError } = await adminQuery(
      "client_briefs",
      "brief_content",
      { user_id: clientId }
    );

    if (briefError || !briefData || briefData.length === 0) {
      return errorResponse(404, "Client brief not found");
    }

    const briefContent = briefData[0].brief_content || "";

    // Create refresh job record
    const jobRecord = await adminInsert("document_refresh_jobs", {
      client_id: clientId,
      subscription_id: subscriptionId || null,
      service_id: serviceId,
      status: "in_progress",
      document_types: documentTypes,
      documents_completed: [],
      documents_failed: [],
      update_instructions: updateInstructions,
      client_notes: clientNotes || null,
      admin_notes: adminNotes || null,
      admin_id: authResult.adminId || null,
      started_at: new Date().toISOString(),
    });

    if (!jobRecord || !jobRecord[0]) {
      return errorResponse(500, "Failed to create refresh job record");
    }

    const jobId = jobRecord[0].id;
    const documentsCompleted: string[] = [];
    const documentsFailed: string[] = [];
    let errorMessage = "";

    // Process each document type
    for (const docType of documentTypes) {
      try {
        console.log(`Processing document: ${docType}`);

        const prompt = buildRefreshPrompt(docType, briefContent, updateInstructions);
        const result = await generateWithAI(prompt);

        // Upsert generated document
        const docRecord = await adminUpsert(
          "generated_documents",
          "client_id",
          clientId,
          {
            client_id: clientId,
            document_type: docType,
            content: result.text,
            provider: result.provider,
            model: result.model,
            updated_at: new Date().toISOString(),
          }
        );

        if (docRecord) {
          documentsCompleted.push(docType);
          console.log(`Successfully updated document: ${docType}`);
        } else {
          documentsFailed.push(docType);
          console.error(`Failed to upsert document: ${docType}`);
        }
      } catch (docError) {
        documentsFailed.push(docType);
        const errMsg = docError instanceof Error ? docError.message : String(docError);
        errorMessage += `${docType}: ${errMsg}; `;
        console.error(`Error processing document ${docType}:`, errMsg);
      }
    }

    // Update job record with final status
    const finalStatus = documentsFailed.length === 0 ? "completed" :
                        documentsCompleted.length === 0 ? "failed" : "completed";

    await adminUpdate("document_refresh_jobs", jobId, {
      status: finalStatus,
      documents_completed: documentsCompleted,
      documents_failed: documentsFailed,
      error_message: errorMessage || null,
      completed_at: new Date().toISOString(),
    });

    return successResponse({
      success: finalStatus === "completed",
      jobId,
      status: finalStatus,
      documentsCompleted,
      documentsFailed,
      errorMessage: errorMessage || undefined,
    });

  } catch (err) {
    console.error("Edge function error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return errorResponse(500, "Internal server error", { details: message });
  }
});
