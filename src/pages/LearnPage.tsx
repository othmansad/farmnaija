import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { usePremium } from "@/contexts/PremiumContext";
import { PremiumModal } from "@/components/PremiumModal";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BookOpen, Home, Menu, Search, PlayCircle, Bug, Sprout, Droplets, Sun, Lightbulb } from "lucide-react";

interface Guide {
  id: string; title: string; titleHa: string; category: string; readTime: string;
  emoji: string; summary: string; summaryHa: string; content: string; contentHa: string;
}

interface Video {
  id: string; title: string; titleHa: string; channel: string; duration: string; thumb: string; url: string;
}

interface Tip {
  id: string; title: string; titleHa: string; body: string; bodyHa: string; icon: any;
}

const GUIDES: Guide[] = [
  {
    id: "1", title: "Maize Planting Guide", titleHa: "Jagorar Shuka Masara", category: "Crops", readTime: "5 min", emoji: "🌽",
    summary: "Complete guide to planting maize in Nigerian conditions",
    summaryHa: "Cikakken jagora don shuka masara a yanayin Najeriya",
    content: "Plant maize at the start of the rainy season (April–June in southern Nigeria, May–July in the north). Space seeds 25cm apart in rows 75cm apart. Apply NPK 15-15-15 at planting and urea 4 weeks after. Weed twice in the first 6 weeks. Harvest after 90–120 days when husks turn brown.",
    contentHa: "Shuka masara a farkon damana. Saka iri 25cm tsakanin tsiro a layi 75cm. Saka taki NPK 15-15-15 yayin shuka."
  },
  {
    id: "2", title: "Rice Cultivation Best Practices", titleHa: "Hanyoyin Shuka Shinkafa", category: "Crops", readTime: "7 min", emoji: "🌾",
    summary: "Lowland and upland rice farming techniques",
    summaryHa: "Dabarun shuka shinkafa",
    content: "For lowland rice, prepare paddies and transplant seedlings 21 days after sowing. For upland rice, drill seeds directly. Maintain water level 5–10cm during vegetative stage. Apply fertilizer in 3 splits. Control birds at grain-filling stage.",
    contentHa: "Don shinkafar fadama, shirya gandu sannan a dasa shuka bayan kwana 21."
  },
  {
    id: "3", title: "Cassava Stem Selection", titleHa: "Zaben Tushen Rogo", category: "Crops", readTime: "4 min", emoji: "🥔",
    summary: "How to choose and prepare healthy cassava cuttings",
    summaryHa: "Yadda ake zaben tsire-tsire na rogo masu lafiya",
    content: "Select 8–12 month old stems from disease-free plants. Cut into 25cm pieces with 5–7 nodes. Plant at 45° angle, 2/3 buried. Spacing: 1m × 1m. Improved varieties like TME 419 yield up to 25 tons/hectare.",
    contentHa: "Zaɓi tushe masu watanni 8–12 daga shuke-shuke marasa cuta."
  },
  {
    id: "4", title: "Soil Testing & pH Management", titleHa: "Gwajin Ƙasa", category: "Soil", readTime: "6 min", emoji: "🧪",
    summary: "Understanding your soil for better yields",
    summaryHa: "Fahimtar ƙasarka don samun amfani mai kyau",
    content: "Test soil every 2–3 years. Most crops prefer pH 6.0–7.0. Add lime to raise pH, sulfur or organic matter to lower it. Sample from 5–10 spots, mix, and send 500g to your local ADP office. Composting improves both pH and nutrients.",
    contentHa: "Yi gwajin ƙasa kowace shekara 2–3."
  },
  {
    id: "5", title: "Integrated Pest Management", titleHa: "Sarrafa Kwari", category: "Pests", readTime: "8 min", emoji: "🐛",
    summary: "Reduce pesticide use with smart pest control",
    summaryHa: "Rage amfani da magani ta hanyar dabaru",
    content: "Use neem oil for aphids and caterpillars (2 tablespoons + 1L water + soap). Plant marigolds between tomato rows to repel nematodes. Rotate crops every season. Hand-pick large pests at dawn. Only use chemical pesticides as a last resort.",
    contentHa: "Yi amfani da man dawakwai don kashe kwari."
  },
  {
    id: "6", title: "Drip Irrigation on a Budget", titleHa: "Ban Ruwa Mai Saukin Kuɗi", category: "Water", readTime: "6 min", emoji: "💧",
    summary: "Affordable irrigation for small-scale farmers",
    summaryHa: "Ban ruwa mai sauƙi don ƙananan manoma",
    content: "DIY drip system: use a 200L drum elevated 1.5m, connect 16mm tubing with 0.5mm holes every 30cm. Saves 60% water vs flood irrigation. Best for tomatoes, peppers, cucumbers. Cost: ₦15,000–25,000 per quarter-acre.",
    contentHa: "Tsarin ban ruwa mai sauƙi don manoma."
  },
];

const VIDEOS: Video[] = [
  { id: "v1", title: "Modern Maize Farming in Nigeria", titleHa: "Shuka Masara ta Zamani", channel: "AgriTV Nigeria", duration: "12:34", thumb: "🌽", url: "https://www.youtube.com/results?search_query=maize+farming+nigeria" },
  { id: "v2", title: "Tomato Greenhouse Setup", titleHa: "Shirya Gidan Tumatir", channel: "FarmHub Africa", duration: "18:22", thumb: "🍅", url: "https://www.youtube.com/results?search_query=tomato+greenhouse+nigeria" },
  { id: "v3", title: "Poultry Brooding First 4 Weeks", titleHa: "Kiwon Kaji Sati 4", channel: "PoultryPro NG", duration: "15:08", thumb: "🐓", url: "https://www.youtube.com/results?search_query=poultry+brooding+nigeria" },
  { id: "v4", title: "Cocoa Pod Disease Control", titleHa: "Maganin Cutar Koko", channel: "CocoaFarmers", duration: "9:41", thumb: "🍫", url: "https://www.youtube.com/results?search_query=cocoa+disease+control" },
  { id: "v5", title: "Fish Pond Construction", titleHa: "Gina Tafkin Kifi", channel: "AquaNaija", duration: "22:15", thumb: "🐟", url: "https://www.youtube.com/results?search_query=fish+pond+construction+nigeria" },
  { id: "v6", title: "Organic Compost Making", titleHa: "Yin Taki na Halitta", channel: "GreenFarm", duration: "11:50", thumb: "🌱", url: "https://www.youtube.com/results?search_query=organic+compost+making" },
];

const TIPS: Tip[] = [
  { id: "t1", title: "Mulch to retain moisture", titleHa: "Yi amfani da ciyawa", body: "Apply 5–10cm of straw or dry grass around plants to keep soil moist and suppress weeds.", bodyHa: "Saka ciyawa kusa da tsire-tsire don kiyaye danshi.", icon: Droplets },
  { id: "t2", title: "Plant cover crops", titleHa: "Shuka tsirrai masu rufewa", body: "Cowpea or mucuna between seasons fixes nitrogen and reduces erosion.", bodyHa: "Wake ko mucuna yana taimakawa ƙasa.", icon: Sprout },
  { id: "t3", title: "Harvest at the right time", titleHa: "Girbi a daidai lokacin", body: "Early morning harvest preserves freshness and reduces post-harvest losses.", bodyHa: "Yi girbi da safe don kiyaye 'ya'yan itace.", icon: Sun },
  { id: "t4", title: "Keep farm records", titleHa: "Adana bayanan gona", body: "Track inputs, yields, and prices to make better decisions next season.", bodyHa: "Rubuta abubuwan da ka yi don gona.", icon: Lightbulb },
  { id: "t5", title: "Rotate crops yearly", titleHa: "Canza shuka kowace shekara", body: "Don't plant the same crop in the same plot 2 years in a row — it depletes nutrients.", bodyHa: "Kar a shuka iri ɗaya wuri ɗaya kowace shekara.", icon: Sprout },
  { id: "t6", title: "Watch for pest signs early", titleHa: "Bincika kwari da wuri", body: "Check leaves underside weekly. Early detection saves entire harvests.", bodyHa: "Duba ƙarƙashin ganye kowane mako.", icon: Bug },
];

const LearnPage = () => {
  const { language } = useApp();
  const { canAccessPremium } = usePremium();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!canAccessPremium) setShowModal(true);
  }, [canAccessPremium]);

  const filteredGuides = GUIDES.filter(g => {
    const q = search.toLowerCase();
    return !q || g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 gradient-header px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 rounded-lg hover:bg-primary-foreground/10">
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary-foreground/15 backdrop-blur-sm p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-primary-foreground font-black text-lg tracking-tight">
              {language === "en" ? "Learn" : "Koyi"}
            </span>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{language === "en" ? "Farming Knowledge" : "Ilimin Noma"}</h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            {language === "en" ? "Expert guides, videos, and best practices" : "Jagorori daga masana"}
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === "en" ? "Search guides, crops, topics…" : "Bincika..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-11">
            <TabsTrigger value="guides" className="text-xs font-bold gap-1.5"><BookOpen className="w-3.5 h-3.5" />{language === "en" ? "Guides" : "Jagorori"}</TabsTrigger>
            <TabsTrigger value="videos" className="text-xs font-bold gap-1.5"><PlayCircle className="w-3.5 h-3.5" />{language === "en" ? "Videos" : "Bidiyo"}</TabsTrigger>
            <TabsTrigger value="tips" className="text-xs font-bold gap-1.5"><Lightbulb className="w-3.5 h-3.5" />{language === "en" ? "Tips" : "Shawarwari"}</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-3 mt-4">
            <Accordion type="single" collapsible className="space-y-2">
              {filteredGuides.map((g) => (
                <AccordionItem key={g.id} value={g.id} className="border-0">
                  <Card className="overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <span className="text-3xl">{g.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm">{language === "en" ? g.title : g.titleHa}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{g.category}</Badge>
                            <span className="text-[10px] text-muted-foreground font-semibold">{g.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-sm font-semibold text-muted-foreground mb-2">{language === "en" ? g.summary : g.summaryHa}</p>
                      <p className="text-sm leading-relaxed">{language === "en" ? g.content : g.contentHa}</p>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
              {filteredGuides.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-sm text-muted-foreground font-semibold">{language === "en" ? "No guides match your search" : "Babu jagora"}</p>
                </Card>
              )}
            </Accordion>
          </TabsContent>

          <TabsContent value="videos" className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {VIDEOS.map((v) => (
              <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                    <span className="text-6xl">{v.thumb}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
                      <PlayCircle className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px]">{v.duration}</Badge>
                  </div>
                  <CardContent className="p-3">
                    <p className="font-black text-sm leading-tight">{language === "en" ? v.title : v.titleHa}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-1">{v.channel}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-2 mt-4">
            {TIPS.map((t) => {
              const Icon = t.icon;
              return (
                <Card key={t.id} className="p-3">
                  <div className="flex gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl h-fit">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm">{language === "en" ? t.title : t.titleHa}</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-1 leading-relaxed">{language === "en" ? t.body : t.bodyHa}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      <PremiumModal open={showModal} onClose={() => { setShowModal(false); if (!canAccessPremium) navigate("/"); }} featureName={language === "en" ? "Learn" : "Koyi"} />
    </div>
  );
};

export default LearnPage;
