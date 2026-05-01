import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_MESSAGES = 30;
const MAX_MESSAGE_LEN = 4000;
const MAX_FIELD_LEN = 200;
const MAX_CROP_DATA_LEN = 4000;

function clampStr(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.slice(0, max);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, state, lga, weather, cropData, language } = body as Record<string, unknown>;

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: "Invalid messages array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeMessages = [];
    for (const m of messages) {
      if (!m || typeof m !== "object") {
        return new Response(JSON.stringify({ error: "Invalid message entry" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const role = (m as any).role;
      const content = (m as any).content;
      if (role !== "user" && role !== "assistant") {
        return new Response(JSON.stringify({ error: "Invalid message role" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (typeof content !== "string" || content.length === 0) {
        return new Response(JSON.stringify({ error: "Invalid message content" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      safeMessages.push({ role, content: content.slice(0, MAX_MESSAGE_LEN) });
    }

    const safeState = clampStr(state, MAX_FIELD_LEN);
    const safeLga = clampStr(lga, MAX_FIELD_LEN);
    const safeWeather = clampStr(weather, MAX_FIELD_LEN);
    const safeCropData = clampStr(cropData, MAX_CROP_DATA_LEN);
    const safeLanguage = language === "ha" ? "ha" : "en";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const langInstruction = safeLanguage === "ha"
      ? "Respond in Hausa language."
      : "Respond in English.";

    const systemPrompt = `You are a Nigerian agricultural extension officer.
State: ${safeState}
Area: ${safeLga}
Weather: ${safeWeather}

Suitable crops and farming data for this state:
${safeCropData}

Rules:
- Give practical, actionable farming advice based on the location and current weather.
- Use simple language a rural farmer can understand.
- Recommend ONLY crops suitable for this specific state (listed above).
- Use the weather data to guide your advice (e.g., delay planting if dry, good time to plant if rain is coming).
- When asked about planting, include spacing, soil preparation, and fertilizer timing.
- Keep responses concise with bullet points for recommendations.
- If the farmer asks about a crop not suited for their state, explain why and suggest alternatives.
${langInstruction}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...safeMessages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("farm-chat error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
