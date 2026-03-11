// lib/cascade.js
// Runs in browser. Calls /api/ai proxy. No keys here.

const VISION_CASCADE = [
  { provider: "gemini", model: "gemini-3.1-flash-lite-preview" },
  { provider: "gemini", model: "gemini-2.5-flash" },
  { provider: "gemini", model: "gemini-2.5-flash-lite" },
  { provider: "groq",   model: "meta-llama/llama-4-scout-17b-16e-instruct" },
  { provider: "gemini", model: "gemini-3-flash-preview" },
];

const TEXT_CASCADE = [
  { provider: "groq",   model: "llama-3.3-70b-versatile" },
  { provider: "groq",   model: "moonshotai/kimi-k2-instruct" },
  { provider: "groq",   model: "qwen/qwen3-32b" },
  { provider: "groq",   model: "openai/gpt-oss-120b" },
  { provider: "groq",   model: "openai/gpt-oss-20b" },
  { provider: "groq",   model: "meta-llama/llama-4-scout-17b-16e-instruct" },
  { provider: "groq",   model: "llama-3.1-8b-instant" },
  { provider: "gemini", model: "gemma-3-27b-it" },
  { provider: "gemini", model: "gemma-3-12b-it" },
  { provider: "gemini", model: "gemma-3-4b-it" },
  { provider: "gemini", model: "gemma-3-2b-it" },
  { provider: "gemini", model: "gemini-3.1-flash-lite-preview" },
  { provider: "gemini", model: "gemini-2.5-flash" },
  { provider: "gemini", model: "gemini-2.5-flash-lite" },
  { provider: "gemini", model: "gemini-3-flash-preview" },
];

const FALLBACK_HTTP_CODES = new Set([429, 503, 502, 504, 529]);
const FALLBACK_KEYWORDS = [
  "rate_limit", "rate limit", "quota_exceeded", "quota",
  "resource_exhausted", "RESOURCE_EXHAUSTED",
  "overloaded", "model_overloaded", "capacity",
  "context_length_exceeded", "context window",
  "tokens_limit", "maximum context", "reduce your prompt",
  "thought_signature", "thoughtSignature",
];

function shouldFallback(httpStatus, responseBody) {
  if (FALLBACK_HTTP_CODES.has(httpStatus)) return true;
  const bodyStr = JSON.stringify(responseBody).toLowerCase();
  return FALLBACK_KEYWORDS.some(k => bodyStr.includes(k.toLowerCase()));
}

export async function callAI({ messages, requiresVision = false, maxTokens = 1000 }) {
  const cascade = requiresVision ? VISION_CASCADE : TEXT_CASCADE;

  for (let i = 0; i < cascade.length; i++) {
    const { provider, model } = cascade[i];

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, model, messages, max_tokens: maxTokens }),
      });

      const data = await res.json();

      if (shouldFallback(res.status, data)) {
        console.warn(`[BookLens] ↩ ${provider}:${model} → ${res.status}, cascading...`);
        continue;
      }

      // Hard errors — bad request or auth, surface immediately
      if (res.status === 400 || res.status === 401) {
        throw new Error(`Config error on ${model}: ${data?.error?.message}`);
      }

      if (!res.ok) {
        console.warn(`[BookLens] ↩ ${provider}:${model} → HTTP ${res.status}, cascading...`);
        continue;
      }

      console.info(`[BookLens] ✓ served by ${provider}:${model}`);
      return {
        content: data.choices[0].message.content,
        model,
        provider,
      };

    } catch (err) {
      if (i === cascade.length - 1) {
        throw new Error("All models exhausted. Please try again in a few minutes.");
      }
      console.warn(`[BookLens] ↩ ${provider}:${model} threw: ${err.message}, cascading...`);
    }
  }
}
