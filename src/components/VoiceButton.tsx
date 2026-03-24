import { Mic, MicOff, Volume2 } from "lucide-react";
import { useState, useRef } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language: string;
}

export const VoiceInputButton = ({ onTranscript, language }: VoiceInputProps) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggle = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ha" ? "ha-NG" : "en-NG";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onTranscript(text);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  // Check if speech recognition is available
  const available = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  if (!available) return null;

  return (
    <button
      onClick={toggle}
      className={`p-2.5 rounded-full transition-colors ${listening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}
      title={listening ? "Stop" : "Voice input"}
    >
      {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export const speakText = (text: string, language: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  // Strip markdown for cleaner speech
  const clean = text.replace(/[*#_\[\]()]/g, "").replace(/\n+/g, ". ");
  
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = language === "ha" ? "ha-NG" : "en-NG";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

interface SpeakButtonProps {
  text: string;
  language: string;
}

export const SpeakButton = ({ text, language }: SpeakButtonProps) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  return (
    <button
      onClick={() => speakText(text, language)}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1"
      title="Listen"
    >
      <Volume2 className="w-3 h-3" />
    </button>
  );
};
