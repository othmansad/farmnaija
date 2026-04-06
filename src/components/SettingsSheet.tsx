import { useApp } from "@/contexts/AppContext";
import { states } from "@/data/locations";
import { t } from "@/data/translations";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings, Globe, MapPin, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SettingsSheet = () => {
  const { language, setLanguage, stateId, setStateId, lga, setLga, stateName } = useApp();
  const [open, setOpen] = useState(false);
  const currentState = states[stateId];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-primary-foreground/70 hover:text-primary-foreground p-2 rounded-xl transition-all duration-200 active:scale-95 hover:bg-primary-foreground/10">
          <Settings className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] bg-background border-l p-0">
        <SheetHeader className="gradient-header px-5 py-6">
          <SheetTitle className="text-primary-foreground font-black text-lg tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {language === "en" ? "Settings" : "Saituna"}
          </SheetTitle>
        </SheetHeader>

        <div className="px-5 py-4 space-y-5">
          {/* Language */}
          <div className="space-y-2">
            <label className="text-farm-label flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {language === "en" ? "Language" : "Harshe"}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 active:scale-95 ${
                  language === "en"
                    ? "gradient-header text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => setLanguage("ha")}
                className={`flex-1 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 active:scale-95 ${
                  language === "ha"
                    ? "gradient-header text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                🇳🇬 Hausa
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-farm-label flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {language === "en" ? "Location" : "Wuri"}
            </label>
            <select
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="w-full p-3 rounded-2xl border bg-card text-sm font-semibold"
            >
              {Object.entries(states).map(([id, s]) => (
                <option key={id} value={id}>{s.name}</option>
              ))}
            </select>
            <select
              value={lga?.name || ""}
              onChange={(e) => {
                const found = currentState?.lgas.find(l => l.name === e.target.value);
                if (found) setLga(found);
              }}
              className="w-full p-3 rounded-2xl border bg-card text-sm font-semibold"
            >
              {currentState?.lgas.map((l) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Admin link */}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between bg-muted/50 rounded-2xl px-4 py-3.5 active:scale-[0.98] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-xl">
                <Shield className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <div className="text-sm font-extrabold">
                  {language === "en" ? "Admin Panel" : "Shafin Gudanarwa"}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {language === "en" ? "Manage alerts & tips" : "Sarrafa faɗakarwa"}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          {/* App info */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground font-semibold">
              🌾 FarmWise Nigeria v1.0
            </p>
            <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">
              {language === "en" ? "Built for Nigerian farmers" : "An gina wa manoman Najeriya"}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
