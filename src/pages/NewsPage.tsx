import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Newspaper, Home, Menu, Building2, CloudLightning, TrendingUp, Search, ExternalLink, Calendar } from "lucide-react";
import { trackEvent } from "@/services/analytics";

type Category = "all" | "news" | "policy" | "weather" | "market";

interface NewsItem {
  id: string;
  category: Exclude<Category, "all">;
  title: { en: string; ha: string };
  summary: { en: string; ha: string };
  source: string;
  date: string; // ISO
  url?: string;
  region?: string;
}

const NEWS: NewsItem[] = [
  {
    id: "1",
    category: "news",
    title: { en: "Federal Government launches dry-season rice initiative", ha: "Gwamnatin Tarayya ta ƙaddamar da shirin shinkafar rani" },
    summary: { en: "FG to support 200,000 smallholder farmers across 12 states with improved seedlings and irrigation kits ahead of the 2026 dry season.", ha: "Gwamnati za ta tallafa wa manoma 200,000 a jihohi 12 da iri masu inganci da kayan ban ruwa kafin lokacin rani na 2026." },
    source: "Daily Trust",
    date: "2026-04-28",
    url: "https://dailytrust.com",
    region: "Nigeria",
  },
  {
    id: "2",
    category: "policy",
    title: { en: "CBN keeps Anchor Borrowers fertilizer subsidy at 30%", ha: "CBN ta riƙe tallafin taki na Anchor Borrowers a 30%" },
    summary: { en: "Central Bank confirms continuation of 30% subsidy on NPK and Urea for registered cooperatives through Q3 2026.", ha: "Babban bankin ƙasa ya tabbatar da ci gaba da tallafin 30% kan NPK da Urea ga ƙungiyoyin manoma har zuwa ƙarshen kwata ta uku ta 2026." },
    source: "CBN",
    date: "2026-04-22",
    region: "Federal",
  },
  {
    id: "3",
    category: "weather",
    title: { en: "NiMet warns of early heavy rains in Middle Belt", ha: "NiMet ta yi gargaɗi kan ruwa mai yawa a tsakiyar gefen ƙasa" },
    summary: { en: "Plateau, Nasarawa and Benue may see above-normal rainfall in early May. Plan drainage and avoid low-lying plots for sensitive crops.", ha: "Filato, Nasarawa da Benuwai za su iya samun ruwa fiye da kima a farkon Mayu. A shirya magudanan ruwa." },
    source: "NiMet",
    date: "2026-04-30",
    region: "Middle Belt",
  },
  {
    id: "4",
    category: "market",
    title: { en: "Maize prices climb 8% in northern markets", ha: "Farashin masara ya tashi 8% a kasuwannin arewa" },
    summary: { en: "A bag of maize now sells between ₦42,000 – ₦46,000 in Kano and Kaduna due to lower carry-over stocks.", ha: "Buhun masara yana sayar tsakanin ₦42,000 – ₦46,000 a Kano da Kaduna." },
    source: "AFEX Market Report",
    date: "2026-04-29",
    region: "North",
  },
  {
    id: "5",
    category: "market",
    title: { en: "Tomato glut drops prices in Jos by 35%", ha: "Yawan tumatir ya rage farashi a Jos da 35%" },
    summary: { en: "Bumper harvest pushes a basket of tomato to ₦9,500 from ₦14,500 last month. Consider preservation and value-addition.", ha: "Yalwar girbi ta sauke kwandon tumatir zuwa ₦9,500 daga ₦14,500." },
    source: "Plateau Agric Bureau",
    date: "2026-04-26",
    region: "Plateau",
  },
  {
    id: "6",
    category: "policy",
    title: { en: "New land-use act amendments target smallholders", ha: "Sabuwar gyaran dokar ƙasa za ta amfani ƙananan manoma" },
    summary: { en: "Proposed amendments aim to simplify Certificate of Occupancy issuance for farmers cultivating under 5 hectares.", ha: "Gyaran ya nufi sauƙaƙa bayar da Takardar Mallakar Ƙasa ga manoma da ke noma ƙasa da hekta 5." },
    source: "National Assembly",
    date: "2026-04-18",
    region: "Federal",
  },
  {
    id: "7",
    category: "weather",
    title: { en: "Sahel zone: dry spell expected mid-May", ha: "Yankin Sahel: ana sa ran rani a tsakiyar Mayu" },
    summary: { en: "NiMet projects 7–10 day dry break in Sokoto, Katsina and Yobe. Delay millet planting until rains stabilize.", ha: "NiMet ta yi hasashen rani na kwana 7-10 a Sokoto, Katsina da Yobe. A jinkirta shukar gero." },
    source: "NiMet",
    date: "2026-04-25",
    region: "Sahel",
  },
  {
    id: "8",
    category: "news",
    title: { en: "Lagos State opens applications for youth agri-grants", ha: "Jihar Legas ta buɗe neman tallafin matasa" },
    summary: { en: "₦3 billion grant pool open until June 30 for young farmers under 35 in poultry, aquaculture and vegetables.", ha: "Tallafin ₦biliyan 3 yana buɗe har 30 ga Yuni ga matasa manoma." },
    source: "Lagos State Govt",
    date: "2026-04-15",
    region: "Lagos",
  },
];

const CAT_META: Record<Exclude<Category, "all">, { icon: typeof Newspaper; color: string; bg: string; label: { en: string; ha: string } }> = {
  news: { icon: Newspaper, color: "text-primary", bg: "bg-primary/10", label: { en: "Agri News", ha: "Labaran Noma" } },
  policy: { icon: Building2, color: "text-secondary", bg: "bg-secondary/10", label: { en: "Policy", ha: "Manufofi" } },
  weather: { icon: CloudLightning, color: "text-accent", bg: "bg-accent/10", label: { en: "Weather", ha: "Yanayi" } },
  market: { icon: TrendingUp, color: "text-harvest", bg: "bg-harvest/15", label: { en: "Market", ha: "Kasuwa" } },
};

const NewsPage = () => {
  const { language } = useApp();
  const { toggleSidebar } = useSidebar();
  const [cat, setCat] = useState<Category>("all");
  const [q, setQ] = useState("");

  useEffect(() => { trackEvent("page_view", "news"); }, []);

  const filtered = useMemo(() => {
    return NEWS.filter(n => {
      if (cat !== "all" && n.category !== cat) return false;
      if (!q) return true;
      const hay = `${n.title.en} ${n.title.ha} ${n.summary.en} ${n.summary.ha} ${n.source}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [cat, q]);

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
        <button onClick={toggleSidebar} className="text-primary-foreground/80 hover:text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10">
          <Menu className="w-5 h-5" />
        </button>
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
          {tabs.map(t => (
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

        {/* News list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="card-farm text-center text-sm font-semibold text-muted-foreground py-10">
              {language === "en" ? "No stories match your search." : "Babu labari da ya dace da binciken."}
            </div>
          )}
          {filtered.map((item, i) => {
            const meta = CAT_META[item.category];
            const Icon = meta.icon;
            return (
              <article
                key={item.id}
                className="card-farm animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`icon-badge ${meta.bg}`}>
                    <Icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                        {meta.label[language]}
                      </span>
                      {item.region && (
                        <span className="text-[10px] font-bold text-muted-foreground">• {item.region}</span>
                      )}
                    </div>
                    <h2 className="font-black text-base leading-snug mb-1.5">{item.title[language]}</h2>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-2.5">
                      {item.summary[language]}
                    </p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.date).toLocaleDateString(language === "ha" ? "ha-NG" : "en-NG", { month: "short", day: "numeric" })}</span>
                        <span>•</span>
                        <span className="font-extrabold text-foreground/70">{item.source}</span>
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary hover:underline"
                        >
                          {language === "en" ? "Read" : "Karanta"} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
