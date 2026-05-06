// Real-time agri news aggregator using Google News RSS (no API key required)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Category = "news" | "policy" | "weather" | "market";

const QUERIES: { category: Category; query: string }[] = [
  { category: "news", query: "Nigeria agriculture farmers" },
  { category: "policy", query: "Nigeria agriculture policy government CBN" },
  { category: "weather", query: "Nigeria NiMet rainfall weather forecast farmers" },
  { category: "market", query: "Nigeria food prices market maize rice tomato" },
];

// Curated Unsplash fallback images per category (stable URLs)
const FALLBACK_IMAGES: Record<Category, string[]> = {
  news: [
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=70",
  ],
  policy: [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=70",
  ],
  weather: [
    "https://images.unsplash.com/photo-1561553873-e8491a564fd0?w=800&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1527482797697-8795b05a13b1?w=800&auto=format&fit=crop&q=70",
  ],
  market: [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=70",
  ],
};

interface NewsItem {
  id: string;
  category: Category;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  image: string;
}

const stripHtml = (s: string) =>
  s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();

const extractImage = (html: string): string | null => {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};

const pickFallback = (cat: Category, seed: string): string => {
  const arr = FALLBACK_IMAGES[cat];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
};

async function fetchFeed(category: Category, query: string): Promise<NewsItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-NG&gl=NG&ceid=NG:en`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 FarmWiseBot" } });
  if (!res.ok) return [];
  const xml = await res.text();

  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = itemRegex.exec(xml)) && i < 8) {
    const block = match[1];
    const title = stripHtml((block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, ""));
    const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "").trim();
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "").trim();
    const source = stripHtml((block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "Google News").replace(/<!\[CDATA\[|\]\]>/g, ""));
    const descRaw = (block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "").replace(/<!\[CDATA\[|\]\]>/g, "");
    const img = extractImage(descRaw);
    const summary = stripHtml(descRaw).slice(0, 220);

    if (title && link) {
      items.push({
        id: `${category}-${i}-${link}`,
        category,
        title,
        summary: summary || title,
        source,
        date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        url: link,
        image: img || pickFallback(category, title),
      });
      i++;
    }
  }
  return items;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const all = await Promise.all(QUERIES.map((q) => fetchFeed(q.category, q.query).catch(() => [])));
    const items = all.flat().sort((a, b) => b.date.localeCompare(a.date));

    return new Response(JSON.stringify({ items, fetchedAt: new Date().toISOString() }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=900", // 15 minutes
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg, items: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
