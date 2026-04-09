import { useApp } from "@/contexts/AppContext";
import { CalendarDays, BarChart3, BookOpen, Users, Newspaper, ArrowLeft, Sprout, Home, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

interface FeaturePageProps {
  title: string;
  titleHa: string;
  description: string;
  descHa: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  comingSoonItems: { label: string; labelHa: string; emoji: string }[];
}

const FeaturePage = ({ title, titleHa, description, descHa, icon: Icon, color, bg, comingSoonItems }: FeaturePageProps) => {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 gradient-header px-4 sm:px-6 py-4 flex items-center gap-3 shadow-lg">
        <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="bg-primary-foreground/15 backdrop-blur-sm p-2 rounded-xl">
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-primary-foreground font-black text-lg tracking-tight">
            {language === "en" ? title : titleHa}
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="card-farm text-center py-10 mb-6">
          <div className={`${bg} p-4 rounded-2xl inline-block mb-4`}>
            <Icon className={`w-10 h-10 ${color}`} />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">
            {language === "en" ? title : titleHa}
          </h1>
          <p className="text-muted-foreground font-semibold text-sm max-w-sm mx-auto">
            {language === "en" ? description : descHa}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-harvest/15 text-harvest-foreground px-4 py-2 rounded-full">
            <Sprout className="w-4 h-4" />
            <span className="text-xs font-extrabold">
              {language === "en" ? "Coming Soon!" : "Na zuwa nan ba da jimawa ba!"}
            </span>
          </div>
        </div>

        {/* Planned features */}
        <h2 className="text-farm-label mb-3 px-1">
          {language === "en" ? "What's planned" : "Abin da aka shirya"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {comingSoonItems.map((item, i) => (
            <div
              key={i}
              className="card-farm flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-sm font-bold">
                {language === "en" ? item.label : item.labelHa}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PlannerPage = () => (
  <FeaturePage
    title="Farm Planner" titleHa="Tsarin Noma"
    description="Plan your planting calendar, set reminders, and organize your farming season." descHa="Tsara kalandar shuka, saita tunatarwa, da tsara lokacin noma."
    icon={CalendarDays} color="text-primary" bg="bg-primary/10"
    comingSoonItems={[
      { label: "Planting Calendar", labelHa: "Kalandar Shuka", emoji: "📅" },
      { label: "Task Reminders", labelHa: "Tunatarwar Aiki", emoji: "⏰" },
      { label: "Harvest Tracker", labelHa: "Mai Binciken Girbi", emoji: "🌾" },
      { label: "Input Calculator", labelHa: "Mai Lissafin Kayan Aiki", emoji: "🧮" },
    ]}
  />
);

export const AnalyticsPage = () => (
  <FeaturePage
    title="Analytics" titleHa="Nazari"
    description="Track weather patterns, crop yields, and market prices for better decisions." descHa="Bibiyar yanayi, amfanin gona, da farashin kasuwa don yanke shawara mai kyau."
    icon={BarChart3} color="text-accent" bg="bg-accent/10"
    comingSoonItems={[
      { label: "Weather Trends", labelHa: "Yanayin Yanayi", emoji: "📊" },
      { label: "Yield Tracking", labelHa: "Bibiyar Amfanin Gona", emoji: "📈" },
      { label: "Market Prices", labelHa: "Farashin Kasuwa", emoji: "💰" },
      { label: "Soil Reports", labelHa: "Rahoton Ƙasa", emoji: "🔬" },
    ]}
  />
);

export const LearnPage = () => (
  <FeaturePage
    title="Learn" titleHa="Koyi"
    description="Access farming guides, video tutorials, and best practices from experts." descHa="Sami jagororin noma, bidiyon koyarwa, da ayyukan kyau daga masana."
    icon={BookOpen} color="text-secondary" bg="bg-secondary/10"
    comingSoonItems={[
      { label: "Farming Guides", labelHa: "Jagororin Noma", emoji: "📚" },
      { label: "Video Tutorials", labelHa: "Bidiyon Koyarwa", emoji: "🎬" },
      { label: "Pest Management", labelHa: "Sarrafa Kwari", emoji: "🐛" },
      { label: "Soil Health Tips", labelHa: "Shawarwarin Lafiyar Ƙasa", emoji: "🌱" },
    ]}
  />
);

export const CommunityPage = () => (
  <FeaturePage
    title="Community" titleHa="Al'umma"
    description="Connect with fellow farmers, share experiences, and ask questions." descHa="Haɗa kai da manoma, raba ƙwarewa, da yin tambayoyi."
    icon={Users} color="text-harvest" bg="bg-harvest/10"
    comingSoonItems={[
      { label: "Farmer Groups", labelHa: "Ƙungiyoyin Manoma", emoji: "👥" },
      { label: "Discussion Forum", labelHa: "Dandalin Tattaunawa", emoji: "💬" },
      { label: "Expert Q&A", labelHa: "Tambaya da Amsa", emoji: "🎓" },
      { label: "Success Stories", labelHa: "Labaran Nasara", emoji: "⭐" },
    ]}
  />
);

export const NewsPage = () => (
  <FeaturePage
    title="News" titleHa="Labarai"
    description="Stay updated with the latest agricultural news, policies, and market trends." descHa="Kasance tare da sabbin labarun noma, manufofi, da yanayin kasuwa."
    icon={Newspaper} color="text-earth" bg="bg-earth/10"
    comingSoonItems={[
      { label: "Agri News Feed", labelHa: "Labaran Noma", emoji: "📰" },
      { label: "Government Policies", labelHa: "Manufofin Gwamnati", emoji: "🏛️" },
      { label: "Weather Alerts", labelHa: "Faɗakarwar Yanayi", emoji: "⚡" },
      { label: "Market Updates", labelHa: "Sabuntawar Kasuwa", emoji: "📢" },
    ]}
  />
);
