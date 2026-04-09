import { usePremium } from "@/contexts/PremiumContext";
import { useApp } from "@/contexts/AppContext";
import { Crown, Sparkles, Check, Zap, Shield, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

const benefits = [
  { icon: Zap, label: "Unlimited access to all tools", labelHa: "Samun damar duk kayan aiki" },
  { icon: Shield, label: "Priority weather alerts", labelHa: "Faɗakarwar yanayi na farko" },
  { icon: Sparkles, label: "AI-powered crop advice", labelHa: "Shawarar amfanin gona ta AI" },
  { icon: Clock, label: "Seasonal planting calendar", labelHa: "Kalandar shuka na yanayi" },
];

const plans = [
  { name: "Monthly", nameHa: "Wata-wata", price: "₦2,500", priceSub: "/month", popular: false },
  { name: "Yearly", nameHa: "Shekara-shekara", price: "₦20,000", priceSub: "/year", popular: true, save: "Save 33%" },
];

export const PremiumModal = ({ open, onClose, featureName }: PremiumModalProps) => {
  const { hasTrialStarted, startTrial, subscribe, trialDaysLeft, isTrialActive } = usePremium();
  const { language } = useApp();
  const en = language === "en";

  if (!open) return null;

  const handleStartTrial = () => {
    startTrial();
    onClose();
  };

  const handleSubscribe = () => {
    subscribe();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-up overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Hero gradient */}
        <div className="relative bg-gradient-to-br from-harvest via-harvest/80 to-primary pt-8 pb-10 px-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {en ? "Unlock FarmWise Pro" : "Buɗe FarmWise Pro"}
            </h2>
            <p className="text-white/80 text-sm font-semibold mt-2 max-w-xs mx-auto">
              {en
                ? `Get full access to ${featureName || "all premium tools"} and supercharge your farming`
                : `Samun cikakken damar ${featureName || "duk kayan aikin premium"} don inganta nomanku`}
            </p>
          </div>
        </div>

        <div className="px-5 pb-6 -mt-4">
          {/* Benefits */}
          <div className="bg-background rounded-2xl p-4 shadow-sm border border-border/50 mb-4">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3">
              {en ? "What you get" : "Abin da za ku samu"}
            </p>
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{en ? b.label : b.labelHa}</span>
                  <Check className="w-4 h-4 text-primary ml-auto flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Trial CTA */}
          {!hasTrialStarted && (
            <Button
              onClick={handleStartTrial}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black text-base shadow-lg hover:shadow-xl transition-all mb-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {en ? "Start 7-Day Free Trial" : "Fara Gwaji na Kwanaki 7 Kyauta"}
            </Button>
          )}

          {hasTrialStarted && isTrialActive && (
            <div className="bg-primary/10 rounded-2xl p-3 text-center mb-3 border border-primary/20">
              <p className="text-sm font-black text-primary">
                🎉 {en ? `Trial active — ${trialDaysLeft} days left` : `Gwaji yana aiki — kwanaki ${trialDaysLeft} sun rage`}
              </p>
            </div>
          )}

          {/* Plans */}
          {(hasTrialStarted || !hasTrialStarted) && (
            <>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3 mt-2 text-center">
                {en ? "Choose a plan" : "Zaɓi shiri"}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {plans.map((plan, i) => (
                  <button
                    key={i}
                    onClick={handleSubscribe}
                    className={`relative rounded-2xl p-4 text-center transition-all border-2 ${
                      plan.popular
                        ? "border-harvest bg-harvest/5 shadow-md"
                        : "border-border hover:border-primary/30 bg-background"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-harvest text-harvest-foreground text-[10px] font-black px-3 py-0.5 rounded-full">
                        {en ? "BEST VALUE" : "MAFI KYAU"}
                      </span>
                    )}
                    {plan.save && (
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                        {plan.save}
                      </span>
                    )}
                    <p className="text-xs font-bold text-muted-foreground">{en ? plan.name : plan.nameHa}</p>
                    <p className="text-xl font-black text-foreground mt-1">{plan.price}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold">{plan.priceSub}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-[10px] text-muted-foreground font-semibold">
            {en ? "Cancel anytime • No hidden fees • Secure payment" : "Soke kowane lokaci • Babu kuɗin ɓoye • Biyan kuɗi mai aminci"}
          </p>
        </div>
      </div>
    </div>
  );
};
