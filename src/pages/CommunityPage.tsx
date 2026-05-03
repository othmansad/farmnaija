import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Users, Home, Menu, MessageSquare, GraduationCap, Star, Heart, MessageCircle, UserPlus, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/services/analytics";
import { THREADS } from "@/data/communityMocks";

type Tab = "groups" | "forum" | "experts" | "stories";

interface Group { id: string; name: { en: string; ha: string }; desc: { en: string; ha: string }; members: number; emoji: string; }
interface Expert { id: string; name: string; title: { en: string; ha: string }; specialty: { en: string; ha: string }; questions: number; verified: boolean; emoji: string; }
interface Story { id: string; farmer: string; location: string; quote: { en: string; ha: string }; impact: { en: string; ha: string }; emoji: string; }

const GROUPS: Group[] = [
  { id: "1", name: { en: "Northern Maize Growers", ha: "Manoman Masara na Arewa" }, desc: { en: "Tips, prices and inputs for maize farmers across the savanna belt.", ha: "Shawarwari da farashi ga manoman masara." }, members: 4823, emoji: "🌽" },
  { id: "2", name: { en: "Smallholder Poultry Hub", ha: "Cibiyar Kiwon Kaji" }, desc: { en: "Disease prevention, feed formulation and broiler economics.", ha: "Hana cututtuka, abinci da tattalin arziƙin kaji." }, members: 2104, emoji: "🐔" },
  { id: "3", name: { en: "Women in Agribusiness NG", ha: "Mata cikin Sana'ar Noma" }, desc: { en: "Funding, mentorship and market access for women-led farms.", ha: "Tallafi da jagoranci ga gonakin mata." }, members: 6542, emoji: "👩‍🌾" },
  { id: "4", name: { en: "Vegetable Farmers Network", ha: "Hanyar Sadarwar Manoman Kayan Lambu" }, desc: { en: "Tomato, pepper, onion: pest control & cold-chain tactics.", ha: "Tumatir, tattasai, albasa." }, members: 3290, emoji: "🥬" },
  { id: "5", name: { en: "Rice Cluster — Kebbi & Niger", ha: "Manoman Shinkafa — Kebbi & Neja" }, desc: { en: "Dry-season scheduling, milling and FX-impacted input pricing.", ha: "Shirin lokacin rani da farashin kayan aiki." }, members: 1876, emoji: "🌾" },
  { id: "6", name: { en: "Soil Health & Composting", ha: "Lafiyar Ƙasa & Taki" }, desc: { en: "Build organic matter, reduce fertilizer dependence sustainably.", ha: "Inganta ƙasa da rage dogaro kan taki." }, members: 1423, emoji: "🌱" },
];



const EXPERTS: Expert[] = [
  { id: "1", name: "Dr. Ibrahim Sani", title: { en: "Agronomist, ABU Zaria", ha: "Masanin Noma, ABU Zaria" }, specialty: { en: "Cereal crops, soil fertility", ha: "Hatsi, lafiyar ƙasa" }, questions: 184, verified: true, emoji: "👨‍🔬" },
  { id: "2", name: "Mrs. Ngozi Ade", title: { en: "Extension Officer, FMARD", ha: "Jami'ar Ilmin Manoma" }, specialty: { en: "Vegetables & post-harvest", ha: "Kayan lambu & adanawa" }, questions: 142, verified: true, emoji: "👩‍🔬" },
  { id: "3", name: "Dr. Tunde Bakare", title: { en: "Veterinarian", ha: "Likitan Dabbobi" }, specialty: { en: "Poultry & ruminants", ha: "Kaji & dabbobi" }, questions: 97, verified: true, emoji: "🩺" },
  { id: "4", name: "Engr. Fatima Abdul", title: { en: "Irrigation Engineer", ha: "Injiniyan Ban Ruwa" }, specialty: { en: "Drip & solar irrigation", ha: "Ban ruwa na hasken rana" }, questions: 63, verified: true, emoji: "⚙️" },
];

const STORIES: Story[] = [
  { id: "1", farmer: "Aliyu Garba", location: "Kano", quote: { en: "Switching to drip irrigation cut my water use in half and doubled my pepper yield.", ha: "Canza zuwa ban ruwa na drip ya rage ruwa rabi kuma ya ninka tattasai." }, impact: { en: "+108% yield, -52% water cost", ha: "+108% amfanin gona" }, emoji: "🌶️" },
  { id: "2", farmer: "Grace Eze", location: "Enugu", quote: { en: "FarmWise alerts helped me delay planting by 9 days — I avoided a wash-out that hit my neighbors.", ha: "Faɗakarwar FarmWise ta taimake ni in jinkirta shuka." }, impact: { en: "Saved ₦340k in inputs", ha: "Ya cece ₦340k" }, emoji: "🌧️" },
  { id: "3", farmer: "Habibu Adamu", location: "Sokoto", quote: { en: "The community taught me triple-bag cowpea storage. Zero pest loss this season.", ha: "Al'umma ta koya min ajiyar wake da buhu uku." }, impact: { en: "0% storage loss", ha: "0% asara" }, emoji: "🫘" },
];

const CommunityPage = () => {
  const { language } = useApp();
  const { toggleSidebar } = useSidebar();
  const [tab, setTab] = useState<Tab>("groups");
  const [joined, setJoined] = useState<Set<string>>(new Set());

  useEffect(() => { trackEvent("page_view", "community"); }, []);

  const tabs: { id: Tab; label: { en: string; ha: string }; icon: typeof Users }[] = [
    { id: "groups", label: { en: "Groups", ha: "Ƙungiyoyi" }, icon: Users },
    { id: "forum", label: { en: "Forum", ha: "Dandali" }, icon: MessageSquare },
    { id: "experts", label: { en: "Experts", ha: "Masana" }, icon: GraduationCap },
    { id: "stories", label: { en: "Stories", ha: "Labarai" }, icon: Star },
  ];

  const toggleJoin = (id: string) => {
    setJoined(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 gradient-header px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 rounded-lg hover:bg-primary-foreground/10">
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary-foreground/15 backdrop-blur-sm p-2 rounded-xl">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-primary-foreground font-black text-lg tracking-tight">
              {language === "en" ? "Community" : "Al'umma"}
            </span>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-primary-foreground/80 hover:text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5 space-y-4">
        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-muted/50 p-1 rounded-2xl">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl text-[10px] sm:text-[11px] font-extrabold transition-all min-w-0 ${
                  active ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate w-full text-center leading-tight">{t.label[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Groups */}
        {tab === "groups" && (
          <div className="space-y-3">
            {GROUPS.map((g, i) => {
              const isJoined = joined.has(g.id);
              return (
                <div key={g.id} className="card-farm flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="text-3xl flex-shrink-0">{g.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base leading-tight">{g.name[language]}</h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">{g.desc[language]}</p>
                    <p className="text-[11px] font-extrabold text-primary mt-1.5">
                      {g.members.toLocaleString()} {language === "en" ? "members" : "membobi"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleJoin(g.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-black inline-flex items-center gap-1 transition-all active:scale-95 ${
                      isJoined ? "bg-primary/15 text-primary" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {isJoined ? (<><CheckCircle2 className="w-3 h-3" /> {language === "en" ? "Joined" : "Ka shiga"}</>) : (<><UserPlus className="w-3 h-3" /> {language === "en" ? "Join" : "Shiga"}</>)}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Forum */}
        {tab === "forum" && (
          <div className="space-y-3">
            <Link to="/chat" className="card-farm flex items-center justify-between bg-primary/5 border-primary/30">
              <div>
                <p className="text-xs font-extrabold text-primary uppercase tracking-wide">{language === "en" ? "Quick post" : "Saƙo cikin sauri"}</p>
                <p className="font-bold text-sm mt-0.5">{language === "en" ? "Ask the community →" : "Tambayi al'umma →"}</p>
              </div>
              <MessageSquare className="w-6 h-6 text-primary" />
            </Link>
            {THREADS.map((th, i) => (
              <Link key={th.id} to={`/community/forum/${th.id}`} className="card-farm block animate-fade-up hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground">{th.tag}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">• {th.lastActive}</span>
                </div>
                <h3 className="font-black text-sm leading-snug">{th.title[language]}</h3>
                <div className="flex items-center justify-between mt-2.5 text-[11px] font-bold text-muted-foreground">
                  <span>by {th.author}</span>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" /> {th.likes}</span>
                    <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {th.replies}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Experts */}
        {tab === "experts" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-semibold px-1">
              {language === "en" ? "Verified experts answer questions weekly. Tap Ask to send a question." : "Masana ne ke amsa tambayoyi a kowane mako."}
            </p>
            {EXPERTS.map((e, i) => (
              <div key={e.id} className="card-farm flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="text-3xl flex-shrink-0">{e.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm">{e.name}</h3>
                    {e.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/20" />}
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">{e.title[language]}</p>
                  <p className="text-xs font-medium mt-1">{e.specialty[language]}</p>
                  <p className="text-[11px] font-extrabold text-primary mt-1.5">{e.questions} {language === "en" ? "questions answered" : "tambayoyi an amsa"}</p>
                </div>
                <Link to="/community/qa" className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-black active:scale-95">
                  {language === "en" ? "Ask" : "Tambaya"}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Stories */}
        {tab === "stories" && (
          <div className="space-y-3">
            {STORIES.map((s, i) => (
              <div key={s.id} className="card-farm animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{s.emoji}</div>
                  <div>
                    <p className="font-black text-sm">{s.farmer}</p>
                    <p className="text-[11px] font-bold text-muted-foreground">📍 {s.location}</p>
                  </div>
                </div>
                <blockquote className="text-sm font-medium italic leading-relaxed text-foreground/90 border-l-2 border-primary pl-3">
                  "{s.quote[language]}"
                </blockquote>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-harvest/15 text-harvest-foreground">
                  <Star className="w-3 h-3" />
                  <span className="text-[11px] font-black">{s.impact[language]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
