// AI Farm Plan Generator - uses Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { crop, area, location, season, language } = await req.json();
    if (!crop || !area) {
      return new Response(JSON.stringify({ error: "crop and area are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const lang = language === "ha" ? "Hausa" : "English";
    const systemPrompt = `You are an experienced Nigerian agricultural extension officer.
Generate a practical, actionable farm plan for a smallholder farmer.
Reply ONLY in ${lang}. Be specific to Nigerian conditions, costs in Naira (₦), and use locally available inputs.`;

    const userPrompt = `Create a detailed farm plan:
- Crop: ${crop}
- Area: ${area}
- Location: ${location || "Nigeria"}
- Season: ${season || "current"}

Return a JSON object with this exact shape:
{
  "summary": "1-2 sentence overview",
  "timeline": [{"week": "Week 1-2", "activity": "Land preparation", "details": "..."}],
  "inputs": [{"item": "Seeds", "quantity": "10 kg", "estimated_cost_ngn": 5000}],
  "tasks": [{"title": "Soil testing", "priority": "high", "when": "Before planting"}],
  "expected_yield": "e.g. 2.5 tonnes",
  "estimated_revenue_ngn": 250000,
  "key_risks": ["pest X", "drought"],
  "tips": ["tip 1", "tip 2"]
}`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_farm_plan",
            description: "Submit a structured farm plan",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                timeline: { type: "array", items: { type: "object", properties: { week: { type: "string" }, activity: { type: "string" }, details: { type: "string" } }, required: ["week", "activity", "details"] } },
                inputs: { type: "array", items: { type: "object", properties: { item: { type: "string" }, quantity: { type: "string" }, estimated_cost_ngn: { type: "number" } }, required: ["item", "quantity", "estimated_cost_ngn"] } },
                tasks: { type: "array", items: { type: "object", properties: { title: { type: "string" }, priority: { type: "string", enum: ["low", "medium", "high"] }, when: { type: "string" } }, required: ["title", "priority", "when"] } },
                expected_yield: { type: "string" },
                estimated_revenue_ngn: { type: "number" },
                key_risks: { type: "array", items: { type: "string" } },
                tips: { type: "array", items: { type: "string" } },
              },
              required: ["summary", "timeline", "inputs", "tasks", "expected_yield", "estimated_revenue_ngn", "key_risks", "tips"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_farm_plan" } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached, please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No plan generated" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const plan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-farm-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
