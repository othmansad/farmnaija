import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Newspaper, Home, Menu, Building2, CloudLightning, TrendingUp, Search, ExternalLink, Calendar, RefreshCw, Loader2 } from "lucide-react";
import { trackEvent } from "@/services/analytics";
import { supabase } from "@/integrations/supabase/client";

type Category = "all" | "news" | "policy" | "weather" | "market";

interface NewsItem {
  id: string;
  category: Exclude<Category, "all">;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  image: string;
}

const CAT_META: Record<Exclude<Category, "all">, { icon: typeof Newspaper; color: string; bg: string; label: { en: string; ha: string } }> = {
  news: { icon: Newspaper, color: "text-primary", bg: "bg-primary/10", label: { en: "Agri News", ha: "Labaran Noma" } },
  policy: { icon: Building2, color: "text-secondary", bg: "bg-secondary/10", label: { en: "Policy", ha: "Manufofi" } },
  weather: { icon: CloudLightning, color: "text-accent", bg: "bg-accent/10", label: { en: "Weather", ha: "Yanayi" } },
  market: { icon: TrendingUp, color: "text-harvest", bg: "bg-harvest/15", label: { en: "Market", ha: "Kasuwa" } },
};

const CACHE_KEY = "farmwise_news_cache_v1";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min

const NewsPage = () => {
  const { language } = useApp();
  const { toggleSidebar } = useSidebar();
  const [cat, setCat] = useState<Category>("all");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const loadNews = async (force = false) => {
    setError(null);
    // Try cache first
    if (!force) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached = JSON.parse(raw) as { items: NewsItem[]; fetchedAt: string; ts: number };
          if (Date.now() - cached.ts < CACHE_TTL_MS && cached.items?.length) {
            setItems(cached.items);
            setFetchedAt(cached.fetchedAt);
            setLoading(false);
            return;
          }
        }
      } catch {}
    }
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("news-feed");
      if (fnError) throw fnError;
      const list: NewsItem[] = data?.items ?? [];
      setItems(list);
      setFetchedAt(data?.fetchedAt ?? new Date().toISOString());
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ items: list, fetchedAt: data?.fetchedAt, ts: Date.now() }));
      } catch {}
    } catch (e) {
      setError(language === "en" ? "Could not load latest news. Showing cached items if available." : "Ba a iya samun sabbin labarai ba.");
      // fall back to any cache regardless of TTL
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached = JSON.parse(raw);
          setItems(cached.items ?? []);
          setFetchedAt(cached.fetchedAt ?? null);
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    trackEvent("page_view", "news");
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (cat !== "all" && n.category !== cat) return false;
      if (!q) return true;
      const hay = `${n.title} ${n.summary} ${n.source}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [items, cat, q]);

  const tabs: { id: Category; label: { en: string; ha: string } }[] = [
    { id: "all", label: { en: "All", ha: "Duka" } },
    { id: "news", label: CAT_META.news.label },
    { id: "policy", label: CAT_META.policy.label },
    { id: "weather", label: CAT_META.weather.label },
    { id: "market", label: CAT_META.market.label },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 gradient-header px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 rounded-lg hover:bg-primary-foreground/10">
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary-foreground/15 backdrop-blur-sm p-2 rounded-xl">
              <Newspaper className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-primary-foreground font-black text-lg tracking-tight">
              {language === "en" ? "News" : "Labarai"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => loadNews(true)}
            aria-label="Refresh"
            className="text-primary-foreground/80 hover:text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={toggleSidebar} className="text-primary-foreground/80 hover:text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={language === "en" ? "Search news, policies, markets…" : "Nemi labarai, manufofi, kasuwa…"}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setCat(t.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                cat === t.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {t.label[language]}
            </button>
          ))}
        </div>

        {fetchedAt && (
          <p className="text-[10px] font-bold text-muted-foreground text-right">
            {language === "en" ? "Updated" : "An sabunta"}: {new Date(fetchedAt).toLocaleString(language === "ha" ? "ha-NG" : "en-NG", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
          </p>
        )}

        {error && (
          <div className="card-farm border-destructive/40 bg-destructive/5 text-destructive text-xs font-bold">
            {error}
          </div>
        )}

        {/* News list */}
        <div className="space-y-3">
          {loading && items.length === 0 && (
            <div className="card-farm flex items-center justify-center gap-2 py-10 text-sm font-semibold text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {language === "en" ? "Fetching latest stories…" : "Ana ɗauko sabbin labarai…"}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="card-farm text-center text-sm font-semibold text-muted-foreground py-10">
              {language === "en" ? "No stories match your search." : "Babu labari da ya dace da binciken."}
            </div>
          )}
          {filtered.map((item, i) => {
            const meta = CAT_META[item.category];
            const Icon = meta.icon;
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block card-farm overflow-hidden p-0 animate-fade-up hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                {item.image && (
                  <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${meta.bg} ${meta.color} backdrop-blur`}>
                      <Icon className="w-3 h-3" />
                      {meta.label[language]}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-black text-base leading-snug mb-1.5">{item.title}</h2>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-3 line-clamp-3">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.date).toLocaleDateString(language === "ha" ? "ha-NG" : "en-NG", { month: "short", day: "numeric" })}</span>
                      <span>•</span>
                      <span className="font-extrabold text-foreground/70">{item.source}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary">
                      {language === "en" ? "Read" : "Karanta"} <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
