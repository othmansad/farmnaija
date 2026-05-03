import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft, Menu, MessageSquare, Send, Heart } from "lucide-react";
import { THREADS, SEED_REPLIES, type Reply } from "@/data/communityMocks";

const ForumThreadPage = () => {
  const { id = "" } = useParams();
  const { language } = useApp();
  const { toggleSidebar } = useSidebar();
  const thread = THREADS.find(t => t.id === id);
  const [replies, setReplies] = useState<Reply[]>(SEED_REPLIES[id] || []);
  const [draft, setDraft] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setReplies(r => [...r, { id: `r${Date.now()}`, author: language === "en" ? "You" : "Kai", body: { en: text, ha: text }, time: language === "en" ? "now" : "yanzu" }]);
    setDraft("");
  };

  if (!thread) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="font-black text-lg mb-2">{language === "en" ? "Thread not found" : "Ba a samu zaren ba"}</p>
          <Link to="/community" className="text-primary font-bold underline">{language === "en" ? "Back to community" : "Komawa al'umma"}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 gradient-header px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/community" className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 rounded-lg hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="bg-primary-foreground/15 backdrop-blur-sm p-2 rounded-xl">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-primary-foreground font-black text-base tracking-tight truncate">
              {language === "en" ? "Forum" : "Dandali"}
            </span>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-primary-foreground/80 hover:text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-3 sm:px-5 py-5 space-y-4">
        <article className="card-farm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground">{thread.tag}</span>
            <span className="text-[10px] font-bold text-muted-foreground">• {thread.lastActive}</span>
          </div>
          <h1 className="font-black text-lg leading-tight">{thread.title[language]}</h1>
          <p className="text-[11px] font-bold text-muted-foreground mt-1">by {thread.author}</p>
          {thread.body && (
            <p className="mt-3 text-sm leading-relaxed font-medium text-foreground/90">{thread.body[language]}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-[11px] font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" /> {thread.likes}</span>
            <span className="inline-flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {replies.length}</span>
          </div>
        </article>

        <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground px-1">
          {language === "en" ? "Replies" : "Amsoshi"} ({replies.length})
        </h2>

        <div className="space-y-3">
          {replies.length === 0 && (
            <p className="text-sm text-muted-foreground font-medium px-1">
              {language === "en" ? "Be the first to reply." : "Ka zama na farkon amsa."}
            </p>
          )}
          {replies.map(r => (
            <div key={r.id} className="card-farm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-black text-sm">{r.author}</p>
                <span className="text-[10px] font-bold text-muted-foreground">{r.time}</span>
              </div>
              <p className="text-sm leading-relaxed font-medium text-foreground/90">{r.body[language]}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="card-farm space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
            {language === "en" ? "Post a reply" : "Bar amsa"}
          </label>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={3}
            placeholder={language === "en" ? "Share your experience…" : "Raba kwarewar ka…"}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2.5 font-black text-sm disabled:opacity-50 active:scale-[0.98] transition"
          >
            <Send className="w-4 h-4" />
            {language === "en" ? "Reply" : "Amsa"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForumThreadPage;
