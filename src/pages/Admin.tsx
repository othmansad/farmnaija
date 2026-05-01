import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Shield, BarChart3, LogIn } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllAlerts, createAlert, deleteAlert,
  fetchSeasonTips, createSeasonTip, deleteSeasonTip,
  type FarmAlert,
} from "@/services/alertsService";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/services/analytics";
import { states } from "@/data/locations";

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"alerts" | "tips" | "analytics">("alerts");
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [saving, setSaving] = useState(false);

  const [alertState, setAlertState] = useState("all");
  const [alertType, setAlertType] = useState("general");
  const [alertTitleEn, setAlertTitleEn] = useState("");
  const [alertTitleHa, setAlertTitleHa] = useState("");
  const [alertMsgEn, setAlertMsgEn] = useState("");
  const [alertMsgHa, setAlertMsgHa] = useState("");

  const [tipState, setTipState] = useState("all");
  const [tipMonth, setTipMonth] = useState(new Date().getMonth() + 1);
  const [tipEn, setTipEn] = useState("");
  const [tipHa, setTipHa] = useState("");

  // Verify admin role server-side via user_roles + RLS
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!error && !!data);
    })();
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllAlerts().then(setAlerts);
      fetchSeasonTips().then(setTips);
    }
  }, [isAdmin]);

  const handleAddAlert = async () => {
    if (!alertTitleEn || saving) return;
    setSaving(true);
    const ok = await createAlert({
      state_id: alertState,
      title_en: alertTitleEn,
      title_ha: alertTitleHa || alertTitleEn,
      message_en: alertMsgEn,
      message_ha: alertMsgHa || alertMsgEn,
      alert_type: alertType,
    });
    if (ok) {
      setAlertTitleEn(""); setAlertTitleHa(""); setAlertMsgEn(""); setAlertMsgHa("");
      fetchAllAlerts().then(setAlerts);
    }
    setSaving(false);
  };

  const handleRemoveAlert = async (id: string) => {
    await deleteAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleAddTip = async () => {
    if (!tipEn || saving) return;
    setSaving(true);
    const ok = await createSeasonTip({
      state_id: tipState,
      month: tipMonth,
      tip_en: tipEn,
      tip_ha: tipHa || tipEn,
    });
    if (ok) {
      setTipEn(""); setTipHa("");
      fetchSeasonTips().then(setTips);
    }
    setSaving(false);
  };

  const handleRemoveTip = async (id: string) => {
    await deleteSeasonTip(id);
    setTips(prev => prev.filter((t: any) => t.id !== id));
  };

  const loadAnalytics = async () => {
    setTab("analytics");
    const summary = await getAnalyticsSummary();
    setAnalytics(summary);
  };

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground font-semibold">Checking access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Shield className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-xl font-bold">Sign in required</h1>
          <p className="text-sm text-muted-foreground">You must sign in to access the admin panel.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 btn-farm justify-center">
            <LogIn className="w-4 h-4" /> Sign in
          </Link>
          <Link to="/" className="block text-center text-sm text-muted-foreground font-semibold">← Back to app</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Shield className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-xl font-bold">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground">
            Your account ({user.email}) does not have admin permissions. Contact a system
            administrator to be granted the <span className="font-mono">admin</span> role.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to app
          </Link>
        </div>
      </div>
    );
  }

  const stateOptions = [{ id: "all", name: "All States" }, ...Object.entries(states).map(([id, s]) => ({ id, name: s.name }))];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const inputClass = "w-full bg-muted rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 gradient-header px-4 sm:px-6 py-4 flex items-center gap-3 shadow-lg">
        <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground active:scale-95 transition-all"><ArrowLeft className="w-5 h-5" /></Link>
        <span className="text-primary-foreground font-black text-lg tracking-tight">Admin Panel</span>
      </header>

      <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto">
        <div className="flex gap-2 mb-5">
          {(["alerts", "tips", "analytics"] as const).map(t => (
            <button
              key={t}
              onClick={() => t === "analytics" ? loadAnalytics() : setTab(t)}
              className={`flex-1 py-3 rounded-2xl text-sm font-extrabold capitalize transition-all duration-200 active:scale-95 ${
                tab === t ? "gradient-header text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
              }`}
            >
              {t === "analytics" ? <span className="flex items-center justify-center gap-1.5"><BarChart3 className="w-4 h-4" /> Stats</span> : t}
            </button>
          ))}
        </div>

        {tab === "alerts" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card-farm space-y-3">
              <h3 className="font-extrabold text-base">New Alert</h3>
              <select value={alertState} onChange={e => setAlertState(e.target.value)} className={inputClass}>
                {stateOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={alertType} onChange={e => setAlertType(e.target.value)} className={inputClass}>
                <option value="pest">🐛 Pest Warning</option>
                <option value="weather">🌧️ Weather Warning</option>
                <option value="season">🌱 Season Alert</option>
                <option value="general">ℹ️ General</option>
              </select>
              <input placeholder="Title (English)" value={alertTitleEn} onChange={e => setAlertTitleEn(e.target.value)} className={inputClass} />
              <input placeholder="Title (Hausa)" value={alertTitleHa} onChange={e => setAlertTitleHa(e.target.value)} className={inputClass} />
              <textarea placeholder="Message (English)" value={alertMsgEn} onChange={e => setAlertMsgEn(e.target.value)} className={inputClass} rows={2} />
              <textarea placeholder="Message (Hausa)" value={alertMsgHa} onChange={e => setAlertMsgHa(e.target.value)} className={inputClass} rows={2} />
              <button onClick={handleAddAlert} disabled={saving} className="w-full btn-farm flex items-center justify-center gap-2 disabled:opacity-50">
                <Plus className="w-4 h-4" /> {saving ? "Saving..." : "Add Alert"}
              </button>
            </div>
            <div className="space-y-3">
              {alerts.map(a => (
                <div key={a.id} className="card-farm flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold">{a.title_en}</div>
                    <div className="text-xs text-muted-foreground font-semibold">{a.alert_type} • {a.state_id === "all" ? "All States" : states[a.state_id]?.name || a.state_id}</div>
                  </div>
                  <button onClick={() => handleRemoveAlert(a.id)} className="text-destructive p-1.5 rounded-xl hover:bg-destructive/10 active:scale-95 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8 font-semibold">No alerts yet</p>}
            </div>
          </div>
        )}

        {tab === "tips" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card-farm space-y-3">
              <h3 className="font-extrabold text-base">New Season Tip</h3>
              <select value={tipState} onChange={e => setTipState(e.target.value)} className={inputClass}>
                {stateOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={tipMonth} onChange={e => setTipMonth(Number(e.target.value))} className={inputClass}>
                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <textarea placeholder="Tip (English)" value={tipEn} onChange={e => setTipEn(e.target.value)} className={inputClass} rows={2} />
              <textarea placeholder="Tip (Hausa)" value={tipHa} onChange={e => setTipHa(e.target.value)} className={inputClass} rows={2} />
              <button onClick={handleAddTip} disabled={saving} className="w-full btn-farm flex items-center justify-center gap-2 disabled:opacity-50">
                <Plus className="w-4 h-4" /> {saving ? "Saving..." : "Add Tip"}
              </button>
            </div>
            <div className="space-y-3">
              {tips.map((tip: any) => (
                <div key={tip.id} className="card-farm flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold">{tip.tip_en}</div>
                    <div className="text-xs text-muted-foreground font-semibold">{months[tip.month - 1]} • {tip.state_id === "all" ? "All States" : states[tip.state_id]?.name || tip.state_id}</div>
                  </div>
                  <button onClick={() => handleRemoveTip(tip.id)} className="text-destructive p-1.5 rounded-xl hover:bg-destructive/10 active:scale-95 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {tips.length === 0 && <p className="text-sm text-muted-foreground text-center py-8 font-semibold">No tips yet</p>}
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-4">
            {!analytics ? (
              <div className="text-center py-8 text-muted-foreground font-semibold">Loading analytics...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="card-farm text-center">
                    <div className="text-3xl font-black text-primary">{analytics.totalUsers}</div>
                    <div className="text-xs text-muted-foreground font-bold">Total Users</div>
                  </div>
                  <div className="card-farm text-center">
                    <div className="text-3xl font-black text-primary">{analytics.chatMessages}</div>
                    <div className="text-xs text-muted-foreground font-bold">Chat Messages</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analytics.topStates.length > 0 && (
                    <div className="card-farm">
                      <h3 className="font-extrabold text-base mb-3">Top States</h3>
                      {analytics.topStates.map(s => (
                        <div key={s.state} className="flex justify-between text-sm py-1.5 font-semibold">
                          <span>{states[s.state]?.name || s.state}</span>
                          <span className="text-muted-foreground">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {analytics.topCrops.length > 0 && (
                    <div className="card-farm">
                      <h3 className="font-extrabold text-base mb-3">Top Crop Queries</h3>
                      {analytics.topCrops.map(c => (
                        <div key={c.crop} className="flex justify-between text-sm py-1.5 font-semibold">
                          <span>{c.crop}</span>
                          <span className="text-muted-foreground">{c.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
