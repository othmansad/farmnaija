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

// Expanded curated Unsplash pool per category — used to guarantee unique images per article
const FALLBACK_IMAGES: Record<Category, string[]> = {
  news: [
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1530507629858-e3759c1f7df0?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=900&auto=format&fit=crop&q=70",
  ],
  policy: [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1573164574511-73c773193279?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=900&auto=format&fit=crop&q=70",
  ],
  weather: [
    "https://images.unsplash.com/photo-1561553873-e8491a564fd0?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1527482797697-8795b05a13b1?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1500740516770-92bd004b996e?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1429552077091-836152271555?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1501691223387-dd0506c89a4c?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=900&auto=format&fit=crop&q=70",
  ],
  market: [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&auto=format&fit=crop&q=70&sat=-20",
    "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=900&auto=format&fit=crop&q=70",
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

const normalizeImg = (u: string): string => {
  // strip query for dedupe comparison
  try { return new URL(u).origin + new URL(u).pathname; } catch { return u; }
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
        image: img || "", // assigned later in dedupe pass
      });
      i++;
    }
  }
  return items;
}

// Ensure no two items share the same image. Prefer extracted images; fall back to category pool with rotation.
function assignUniqueImages(items: NewsItem[]): NewsItem[] {
  const used = new Set<string>();
  const cursor: Record<Category, number> = { news: 0, policy: 0, weather: 0, market: 0 };

  return items.map((item) => {
    let chosen = item.image && item.image.trim() ? item.image : "";
    if (chosen) {
      const key = normalizeImg(chosen);
      if (used.has(key)) chosen = ""; // duplicate -> fall through to pool
      else used.add(key);
    }

    if (!chosen) {
      const pool = FALLBACK_IMAGES[item.category];
      // try up to pool.length unique picks starting from cursor
      for (let attempt = 0; attempt < pool.length; attempt++) {
        const candidate = pool[(cursor[item.category] + attempt) % pool.length];
        const key = normalizeImg(candidate);
        if (!used.has(key)) {
          chosen = candidate;
          used.add(key);
          cursor[item.category] = (cursor[item.category] + attempt + 1) % pool.length;
          break;
        }
      }
      // Last resort: append a sig query so URL is at least unique even if image repeats
      if (!chosen) {
        const base = pool[cursor[item.category] % pool.length];
        chosen = base + (base.includes("?") ? "&" : "?") + "sig=" + encodeURIComponent(item.id.slice(0, 8));
        cursor[item.category] = (cursor[item.category] + 1) % pool.length;
      }
    }

    return { ...item, image: chosen };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const all = await Promise.all(QUERIES.map((q) => fetchFeed(q.category, q.query).catch(() => [])));
    const sorted = all.flat().sort((a, b) => b.date.localeCompare(a.date));
    const items = assignUniqueImages(sorted);

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
