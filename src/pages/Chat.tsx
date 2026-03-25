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

    // If offline, use local knowledge base
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
      // Fallback to offline response on network error
      const reply = getOfflineResponse({ message: text, stateId, language });
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="bg-card border-b px-4 py-3 flex items-center gap-3">
        <a href="/" className="text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div className="flex items-center gap-2">
          <span className="text-xl">🧑‍🌾</span>
          <div>
            <div className="font-semibold text-sm">{t("farmingAssistant", language)}</div>
            <div className="text-xs text-muted-foreground">
              {lga?.name}, {stateName}
              {isOffline && <span className="ml-1 text-yellow-600">• Offline</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div>
                  <div className="prose prose-sm max-w-none">
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
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-card px-4 py-3">
        <div className="flex gap-2">
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
            className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-primary text-primary-foreground p-2.5 rounded-full disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
