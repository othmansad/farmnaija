import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { useWeatherData } from "@/components/WeatherCard";
import { getWeatherSummary } from "@/services/weather";
import { getCropDataSummary } from "@/data/farmingKnowledge";
import { getOfflineResponse } from "@/services/offlineChat";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VoiceInputButton, SpeakButton } from "@/components/VoiceButton";
import { trackEvent } from "@/services/analytics";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatPage = () => {
  const { language, stateName, stateId, lga } = useApp();
  const { weather } = useWeatherData();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("welcomeMsg", language) },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    trackEvent("chat_message", text.substring(0, 50));
    setLoading(true);

    if (!navigator.onLine) {
      const reply = getOfflineResponse({ message: text, stateId, language });
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      setLoading(false);
      return;
    }

    try {
      const weatherSummary = weather ? getWeatherSummary(weather) : "Weather data unavailable";
      const cropData = getCropDataSummary(stateId, language);

      const { data, error } = await supabase.functions.invoke("farm-chat", {
        body: {
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          state: stateName,
          lga: lga?.name || "",
          weather: weatherSummary,
          cropData,
          language,
        },
      });

      if (error) throw error;
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      const reply = getOfflineResponse({ message: text, stateId, language });
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="gradient-header px-5 py-4 flex items-center gap-3.5 shadow-lg">
        <a href="/" className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 -ml-1 active:scale-95 transition-all duration-200">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/15 backdrop-blur-sm p-2.5 rounded-2xl">
            <span className="text-2xl">🧑‍🌾</span>
          </div>
          <div>
            <div className="font-extrabold text-sm text-primary-foreground tracking-tight">{t("farmingAssistant", language)}</div>
            <div className="text-xs text-primary-foreground/65 flex items-center gap-1.5 font-semibold">
              📍 {lga?.name}, {stateName}
              {isOffline && <span className="ml-1 bg-harvest/30 text-harvest-foreground px-2 py-0.5 rounded-full text-[10px] font-extrabold">Offline</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3.5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "gradient-header text-primary-foreground rounded-br-lg shadow-md font-semibold"
                  : "bg-card text-foreground rounded-bl-lg shadow-sm border"
              }`}
            >
              {msg.role === "assistant" ? (
                <div>
                  <div className="prose prose-sm max-w-none font-medium">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <SpeakButton text={msg.content} language={language} />
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-up">
            <div className="bg-card border rounded-2xl rounded-bl-lg px-4 py-3.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground font-bold">
                  {language === "en" ? "Thinking..." : "Ina tunani..."}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card px-4 py-3.5" style={{ boxShadow: "0 -4px 16px -4px hsl(20 40% 12% / 0.06)" }}>
        <div className="flex gap-2.5 items-end">
          <VoiceInputButton
            onTranscript={(text) => setInput(prev => prev ? prev + " " + text : text)}
            language={language}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t("askFarmer", language)}
            className="flex-1 bg-muted rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30 placeholder:font-medium placeholder:text-muted-foreground transition-all duration-200"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="gradient-header text-primary-foreground p-3.5 rounded-2xl disabled:opacity-40 active:scale-95 transition-all duration-200 shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
