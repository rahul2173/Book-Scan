import { NextResponse } from "next/server";

export const runtime = "edge";

const ENDPOINTS = {
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  groq:   "https://api.groq.com/openai/v1/chat/completions",
};

const API_KEYS = {
  gemini: () => process.env.GEMINI_KEY,
  groq:   () => process.env.GROQ_KEY,
};

// In-memory rate limiting map
// Keys: IP address, Values: { count: number, resetTime: number }
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 requests per IP per minute

export async function POST(request) {
  try {
    // 1. Basic IP Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    
    // Cleanup old entries occasionally (simple approach)
    if (Math.random() < 0.05) {
      for (const [key, data] of rateLimitMap.entries()) {
        if (data.resetTime < now) rateLimitMap.delete(key);
      }
    }

    const requestData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
    
    if (requestData.resetTime < now) {
      requestData.count = 1;
      requestData.resetTime = now + RATE_LIMIT_WINDOW_MS;
    } else {
      requestData.count++;
    }
    
    rateLimitMap.set(ip, requestData);

    if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: { message: "Rate limit exceeded. Try again in a minute." } },
        { status: 429 }
      );
    }

    // 2. Body Parsing & Processing
    const { provider, model, messages, max_tokens } = await request.json();

    if (!ENDPOINTS[provider]) {
      return NextResponse.json(
        { error: { message: `Unknown provider: ${provider}` } },
        { status: 400 }
      );
    }

    const apiKey = API_KEYS[provider]();
    if (!apiKey) {
      return NextResponse.json(
        { error: { message: `${provider.toUpperCase()}_KEY not configured in environment variables` } },
        { status: 500 }
      );
    }

    const response = await fetch(ENDPOINTS[provider], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    return NextResponse.json(
      { error: { message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
