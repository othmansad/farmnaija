import { Mic, Square, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  language: string;
}

const getRecognition = () =>
  (typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
  null;

export const VoiceInputButton = ({ onTranscript, onInterim, language }: VoiceInputProps) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  const stop = () => {
    try { recognitionRef.current?.stop(); } catch {}
    setListening(false);
  };

  const start = () => {
    const SpeechRecognition = getRecognition();
    if (!SpeechRecognition) {
      toast({
        title: language === "en" ? "Voice not supported" : "Ba a tallafi murya ba",
        description:
          language === "en"
            ? "Try Chrome on Android or Safari on iOS."
            : "Gwada Chrome ko Safari.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ha" ? "ha-NG" : "en-NG";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalText = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (interim && onInterim) onInterim(interim);
    };

    recognition.onerror = (e: any) => {
      setListening(false);
      const code = e?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        toast({
          title: language === "en" ? "Microphone blocked" : "An hana makirufo",
          description:
            language === "en"
              ? "Allow microphone access in your browser settings."
              : "Ba da izinin makirufo a mai binciken ka.",
        });
      } else if (code === "no-speech") {
        toast({
          title: language === "en" ? "Didn't catch that" : "Ban ji ba",
          description: language === "en" ? "Try speaking again." : "Sake gwadawa.",
        });
      }
    };

    recognition.onend = () => {
      setListening(false);
      const clean = finalText.trim();
      if (clean) onTranscript(clean);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const available = !!getRecognition();
  if (!available) return null;

  const label = listening
    ? language === "en" ? "Stop" : "Tsaya"
    : language === "en" ? "Speak" : "Yi magana";

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      aria-label={label}
      title={label}
      className={`flex items-center justify-center h-12 w-12 rounded-2xl transition-all duration-200 active:scale-95 shadow-sm ${
        listening
          ? "bg-destructive text-destructive-foreground animate-pulse ring-2 ring-destructive/40"
          : "bg-accent text-accent-foreground hover:bg-accent/90"
      }`}
    >
      {listening ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export const speakText = (text: string, language: string) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[*#_\[\]()`]/g, "").replace(/\n+/g, ". ");
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = language === "ha" ? "ha-NG" : "en-NG";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
};

interface SpeakButtonProps {
  text: string;
  language: string;
}

export const SpeakButton = ({ text, language }: SpeakButtonProps) => {
  const [speaking, setSpeaking] = useState(false);

  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const clean = text.replace(/[*#_\[\]()`]/g, "").replace(/\n+/g, ". ");
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = language === "ha" ? "ha-NG" : "en-NG";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={speaking ? (language === "en" ? "Stop" : "Tsaya") : language === "en" ? "Listen" : "Saurara"}
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground mt-2 transition-colors"
    >
      {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      {speaking ? (language === "en" ? "Stop" : "Tsaya") : language === "en" ? "Listen" : "Saurara"}
    </button>
  );
};
