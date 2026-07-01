import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft, Menu, GraduationCap, Send, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

interface Question {
  id: string;
  topic: string;
  body: string;
  status: "pending" | "answered";
  answer?: string;
  expert?: string;
  createdAt: string;
}

const SEED: Question[] = [
  {
    id: "q1",
    topic: "Cassava",
    body: "My cassava leaves are turning yellow at 3 months. Is this nutrient deficiency or disease?",
    status: "answered",
    expert: "Dr. Ibrahim Sani",
    answer: "Most likely nitrogen deficiency if uniform yellowing starts on older leaves. If it's mottled/mosaic, suspect Cassava Mosaic Virus and rogue infected plants.",
    createdAt: "2d",
  },
  {
    id: "q2",
    topic: "Poultry",
    body: "Best broiler feed brand for low-cost finishing in northern Nigeria?",
    status: "pending",
    createdAt: "5h",
  },
];

const ExpertQAPage = () => {
  const { language } = useApp();
  const { toggleSidebar } = useSidebar();
  const [questions, setQuestions] = useState<Question[]>(SEED);
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setQuestions(q => [
      {
        id: `q${Date.now()}`,
        topic: topic.trim() || (language === "en" ? "General" : "Gaba ɗaya"),
        body: body.trim(),
        status: "pending",
        createdAt: language === "en" ? "now" : "yanzu",
      },
      ...q,
    ]);
    setTopic("");
    setBody("");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={GraduationCap}
        title={language === "en" ? "Expert Q&A" : "Tambaya da Amsa"}
        subtitle={language === "en" ? "Ask verified experts" : "Tambayi masana"}
        backTo="/community"
      />

      <div className="max-w-2xl mx-auto px-3 sm:px-5 py-4 sm:py-6 pb-24 space-y-4">
        <form onSubmit={submit} className="card-farm space-y-3">
          <h2 className="font-black text-base">
            {language === "en" ? "Ask an expert" : "Tambayi masani"}
          </h2>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={language === "en" ? "Topic (e.g. Maize, Poultry)" : "Batun (misali Masara)"}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            placeholder={language === "en" ? "Describe your question with as much detail as possible…" : "Bayyana tambayar ka…"}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={!body.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2.5 font-black text-sm disabled:opacity-50 active:scale-[0.98] transition"
          >
            <Send className="w-4 h-4" />
            {language === "en" ? "Submit Question" : "Aika Tambaya"}
          </button>
        </form>

        <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground px-1">
          {language === "en" ? "Your questions" : "Tambayoyin ka"} ({questions.length})
        </h2>

        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className="card-farm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground">{q.topic}</span>
                {q.status === "answered" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-primary">
                    <CheckCircle2 className="w-3 h-3" /> {language === "en" ? "Answered" : "An amsa"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-muted-foreground">
                    <Clock className="w-3 h-3" /> {language === "en" ? "Pending" : "Ana jira"}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold leading-snug">{q.body}</p>
              <p className="text-[10px] font-bold text-muted-foreground mt-1">{q.createdAt}</p>
              {q.status === "answered" && q.answer && (
                <div className="mt-3 border-l-2 border-primary pl-3">
                  <p className="text-[11px] font-black text-primary">{q.expert}</p>
                  <p className="text-sm font-medium leading-relaxed mt-0.5 text-foreground/90">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertQAPage;
