import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Calendar, Package, ListChecks, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface FarmPlan {
  summary: string;
  timeline: { week: string; activity: string; details: string }[];
  inputs: { item: string; quantity: string; estimated_cost_ngn: number }[];
  tasks: { title: string; priority: string; when: string }[];
  expected_yield: string;
  estimated_revenue_ngn: number;
  key_risks: string[];
  tips: string[];
}

const CROP_OPTIONS = ["Maize", "Rice", "Cassava", "Yam", "Tomato", "Pepper", "Groundnut", "Sorghum", "Millet", "Cowpea", "Cocoa", "Soybean"];

export const AIPlanGenerator = () => {
  const { language, location } = useApp();
  const en = language === "en";
  const [crop, setCrop] = useState("Maize");
  const [area, setArea] = useState("1 hectare");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<FarmPlan | null>(null);

  const generate = async () => {
    setLoading(true);
    setPlan(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-farm-plan", {
        body: {
          crop,
          area,
          location: location ? `${location.lga}, ${location.state}` : "Nigeria",
          season,
          language,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPlan(data.plan);
      toast.success(en ? "Plan generated!" : "An samar da tsari!");
    } catch (e: any) {
      toast.error(e?.message || (en ? "Failed to generate plan" : "Ya kasa samar da tsari"));
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => `₦${n.toLocaleString()}`;
  const totalCost = plan?.inputs.reduce((s, i) => s + (i.estimated_cost_ngn || 0), 0) || 0;

  return (
    <div className="space-y-3">
      <Card className="p-4 bg-gradient-to-br from-primary/10 via-accent/10 to-harvest/10 border-primary/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-primary/20 p-1.5 rounded-lg"><Sparkles className="w-4 h-4 text-primary" /></div>
          <h3 className="font-black text-sm">{en ? "AI Farm Plan Generator" : "AI Mai Tsara Noma"}</h3>
          <Badge className="ml-auto bg-harvest text-harvest-foreground text-[9px]">PRO</Badge>
        </div>
        <p className="text-xs text-muted-foreground font-semibold mb-3">
          {en ? "Get an AI-tailored season plan, costs, and tasks for your farm." : "Sami tsarin noma, kuɗi da ayyuka."}
        </p>

        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground">{en ? "Crop" : "Amfanin Gona"}</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {CROP_OPTIONS.map(c => (
                <button key={c} onClick={() => setCrop(c)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-2 transition-all ${crop === c ? "border-primary bg-primary/15 text-primary" : "border-transparent bg-muted/50"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground">{en ? "Area" : "Yanki"}</label>
              <Input value={area} onChange={e => setArea(e.target.value)} placeholder="1 hectare" className="h-9 text-xs mt-1" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground">{en ? "Season (optional)" : "Lokaci"}</label>
              <Input value={season} onChange={e => setSeason(e.target.value)} placeholder={en ? "Rainy / dry" : "Damana / rani"} className="h-9 text-xs mt-1" />
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full font-bold gap-2" size="sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? (en ? "Generating…" : "Ana samarwa…") : (en ? "Generate Plan" : "Samar da Tsari")}
          </Button>
        </div>
      </Card>

      {plan && (
        <div className="space-y-3 animate-fade-up">
          <Card className="p-4">
            <p className="text-sm leading-relaxed font-medium">{plan.summary}</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-primary/10 rounded-xl p-2.5">
                <p className="text-[10px] font-bold text-muted-foreground">{en ? "Expected Yield" : "Yawan Amfani"}</p>
                <p className="text-sm font-black text-primary mt-0.5">{plan.expected_yield}</p>
              </div>
              <div className="bg-harvest/10 rounded-xl p-2.5">
                <p className="text-[10px] font-bold text-muted-foreground">{en ? "Est. Revenue" : "Kudin Shiga"}</p>
                <p className="text-sm font-black text-harvest-foreground mt-0.5 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{fmt(plan.estimated_revenue_ngn)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3"><Calendar className="w-4 h-4 text-primary" /><h4 className="font-black text-sm">{en ? "Timeline" : "Lokaci"}</h4></div>
            <div className="space-y-2">
              {plan.timeline.map((t, i) => (
                <div key={i} className="border-l-2 border-primary/40 pl-3 pb-2">
                  <p className="text-[10px] font-black text-primary uppercase">{t.week}</p>
                  <p className="text-sm font-bold mt-0.5">{t.activity}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.details}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-primary" /><h4 className="font-black text-sm">{en ? "Inputs & Costs" : "Kayan Aiki"}</h4></div>
            <div className="space-y-1.5">
              {plan.inputs.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-border/40 last:border-0">
                  <div><span className="font-bold">{i.item}</span> <span className="text-muted-foreground">— {i.quantity}</span></div>
                  <span className="font-black text-primary">{fmt(i.estimated_cost_ngn)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-1 border-t-2 border-border">
                <span className="text-xs font-black">{en ? "Total" : "Jimillar"}</span>
                <span className="text-sm font-black text-harvest-foreground">{fmt(totalCost)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3"><ListChecks className="w-4 h-4 text-primary" /><h4 className="font-black text-sm">{en ? "Action Tasks" : "Ayyuka"}</h4></div>
            <div className="space-y-1.5">
              {plan.tasks.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <Badge variant="outline" className={`text-[9px] ${t.priority === "high" ? "border-destructive text-destructive" : t.priority === "medium" ? "border-harvest" : "border-primary"}`}>{t.priority}</Badge>
                  <div className="flex-1"><p className="font-bold">{t.title}</p><p className="text-[10px] text-muted-foreground">{t.when}</p></div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="p-4 bg-destructive/5 border-destructive/20">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-destructive" /><h4 className="font-black text-sm">{en ? "Risks" : "Hatsari"}</h4></div>
              <ul className="space-y-1 text-xs">{plan.key_risks.map((r, i) => <li key={i} className="text-muted-foreground">• {r}</li>)}</ul>
            </Card>
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2"><Lightbulb className="w-4 h-4 text-primary" /><h4 className="font-black text-sm">{en ? "Pro Tips" : "Shawarwari"}</h4></div>
              <ul className="space-y-1 text-xs">{plan.tips.map((t, i) => <li key={i} className="text-muted-foreground">• {t}</li>)}</ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
